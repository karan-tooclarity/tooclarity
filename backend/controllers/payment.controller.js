// controllers/payment.controller.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const Subscription = require("../models/Subscription");
const InstituteAdmin = require("../models/InstituteAdmin");
const Coupon = require("../models/coupon");
const RedisUtil = require("../utils/redis.util");

// CORRECT: Importing the job function
const { addPaymentSuccessEmailJob } = require('../jobs/email.job.js');

const PLANS = require("../config/plans");
const logger = require('pino')();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { planType = "yearly", couponCode } = req.body;
  const userId = req.userId;

  const institution = await InstituteAdmin.findById(userId).select("institution");
  const institutionId = institution?.institution;

  console.log("[Payment] Create order request received:", {
    userId,
    institutionId,
    planType,
    couponCode,
  });

  if (!institutionId) {
    console.error("[Payment] Institution not found:", institutionId);
    return next(new AppError("Institution not found", 404));
  }

  console.log("[Payment] Institution ownership verified:", institutionId);

  // ✅ Validate plan
  let amount = PLANS[planType];
  if (!amount) {
    console.error("[Payment] Invalid plan type:", planType);
    return next(new AppError("Invalid plan type specified", 400));
  }
  console.log("[Payment] Plan validated:", { planType, baseAmount: amount });

  // ✅ Check coupon
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode,
      // institutions: institutionId, // check institution-specific coupon
    });

    if (!coupon) {
      return next(new AppError("Invalid or unauthorized coupon code", 400));
    }

    // ✅ Check expiry
    if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
      return next(new AppError("Coupon has expired", 400));
    }

    // ✅ Apply discount
    const discount = (amount * coupon.discountPercentage) / 100;
    amount = Math.max(0, amount - discount); // don’t go below 0

    console.log("[Payment] Coupon applied:", {
      couponCode,
      discountPercentage: coupon.discountPercentage,
      discount,
      finalAmount: amount,
    });
  }

  // ✅ Razorpay order creation
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  console.log("[Payment] Creating Razorpay order with options:", options);

  let order;
  try {
    order = await razorpay.orders.create(options);
    console.log("[Payment] Razorpay order created:", order);
  } catch (err) {
    console.error("[Payment] Razorpay order creation failed:", err);
    return next(new AppError("Failed to create order with Razorpay", 500));
  }

  // ✅ Save subscription record
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { institution: institutionId },
      {
        planType,
        status: "pending",
        razorpayOrderId: order.id,
        razorpayPaymentId: null,
        startDate: null,
        endDate: null,
      },
      { upsert: true, new: true }
    );
    console.log("[Payment] Subscription record updated:", subscription);
  } catch (err) {
    console.error("[Payment] Subscription DB update failed:", err);
    return next(new AppError("Failed to update subscription", 500));
  }

  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    orderId: order.id,
  });
  console.log("[Payment] Order response sent to client");
});

exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    logger.warn("[Payment Webhook] Invalid signature received.");
    return res.status(400).json({ status: "error", message: "Invalid signature" });
  }

  const { event, payload } = req.body;
  if (event === "payment.captured") {
    const { order_id, id: payment_id, amount } = payload.payment.entity;

    const session = await mongoose.startSession();
    session.startTransaction();

    let subscriptionDataForEmail;

    try {
      const subscription = await Subscription.findOne({ razorpayOrderId: order_id }).session(session);

      if (!subscription || subscription.status !== 'pending') {
        logger.warn({ order_id }, `[Payment Webhook] No pending subscription found or already processed.`);
        await session.abortTransaction();
        session.endSession();
        return res.status(200).send("OK");
      }

      subscription.status = "active";
      subscription.razorpayPaymentId = payment_id;
      subscription.startDate = new Date();
      subscription.endDate = subscription.planType === "yearly"
        ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        : new Date(new Date().setMonth(new Date().getMonth() + 1));

      await subscription.save({ session });

      if (subscription.coupon) {
        await Coupon.updateOne({ _id: subscription.coupon }, { $inc: { useCount: 1 } }, { session });
        logger.info({ couponId: subscription.coupon, order_id }, "[Payment Webhook] Coupon usage incremented.");
      }

      await InstituteAdmin.updateOne({ institution: subscription.institution }, { $set: { isPaymentDone: true } }, { session });

      await session.commitTransaction();

      subscriptionDataForEmail = {
        institution: subscription.institution,
        planType: subscription.planType,
        startDate: subscription.startDate,
        endDate: subscription.endDate
      };

      await RedisUtil.setex(`sub_status:${subscription.institution.toString()}`, 3600, "active");
      logger.info({ order_id, institutionId: subscription.institution }, "[Payment Webhook] Subscription activated successfully.");

    } catch (error) {
      await session.abortTransaction();
      logger.error({ error, order_id }, "[Payment Webhook] Transaction failed during payment verification.");
      return next(new AppError("Failed to verify payment due to a server error.", 500));
    } finally {
      session.endSession();
    }

    if (subscriptionDataForEmail) {
      const adminUser = await InstituteAdmin.findOne({ institution: subscriptionDataForEmail.institution }).select('email');

      if (adminUser && adminUser.email) {
        // CORRECT: Adding the job to the queue
        await addPaymentSuccessEmailJob({
          name: adminUser.name,
          email: adminUser.email,
          planType: subscriptionDataForEmail.planType,
          amount: amount,
          orderId: order_id,
          startDate: subscriptionDataForEmail.startDate,
          endDate: subscriptionDataForEmail.endDate,
        });
      } else {
        logger.warn({ order_id, institutionId: subscriptionDataForEmail.institution }, "[Payment Webhook] Could not find user email to add email job.");
      }
    }
  }

  res.status(200).json({ status: "success" });
});

exports.pollSubscriptionStatus = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing userId" });
    }

    const subscription = await Subscription.aggregate([
      {
        $lookup: {
          from: "instituteadmins",
          localField: "institution",
          foreignField: "institution",
          as: "admin",
        },
      },
      { $unwind: "$admin" },
      {
        $match: {
          "admin._id": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          status: 1,
          planType: 1,
          startDate: 1,
          endDate: 1,
        },
      },
    ]);

    if (!subscription) {
      return res.status(404).json({ success: false, message: "pending" });
    }

    return res
      .status(200)
      .json({ success: true, message: subscription[0].status });
  } catch (err) {
    console.error("[Poll Subscription] ❌ Error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});
