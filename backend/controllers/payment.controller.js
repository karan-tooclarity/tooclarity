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
const Course = require("../models/Course");

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

  console.log("[Payment] Create order request received:", {
    userId,
    planType,
    couponCode,
  });

  // ✅ Step 1: Get institution linked to admin
  const institutionDoc = await InstituteAdmin.findById(userId).select("institution");
  const institutionId = institutionDoc?.institution;
  if (!institutionId) {
    console.error("[Payment] Institution not found for user:", userId);
    return next(new AppError("Institution not found", 404));
  }
  console.log("[Payment] Institution found:", institutionId);

  // ✅ Step 2: Count inactive courses for institution
  const inactiveResult = await InstituteAdmin.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "courses",
        let: { institutionId: "$institution" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$institution", "$$institutionId"] },
                  { $eq: ["$status", "Inactive"] },
                ],
              },
            },
          },
          { $count: "totalInactiveCourses" },
        ],
        as: "courseStats",
      },
    },
    {
      $project: {
        _id: 0,
        totalInactiveCourses: {
          $ifNull: [{ $arrayElemAt: ["$courseStats.totalInactiveCourses", 0] }, 0],
        },
      },
    },
  ]);

  const totalInactiveCourses = inactiveResult[0]?.totalInactiveCourses || 0;
  console.log("[Payment] Inactive course count:", totalInactiveCourses);

  // ✅ Step 3: Validate plan type and get base amount
  const planPrice = PLANS[planType.toLowerCase()];
  if (!planPrice) {
    console.error("[Payment] Invalid plan type:", planType);
    return next(new AppError("Invalid plan type specified", 400));
  }

  let amount = totalInactiveCourses * planPrice;
  console.log("[Payment] Base amount (before coupon):", amount);

  // ✅ Step 4: Check coupon validity and apply discount if applicable
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return next(new AppError("Invalid or unauthorized coupon code", 400));
    }

    if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
      return next(new AppError("Coupon has expired", 400));
    }

    const discount = (amount * coupon.discountPercentage) / 100;
    amount = Math.max(0, amount - discount);

    console.log("[Payment] Coupon applied:", {
      couponCode,
      discountPercentage: coupon.discountPercentage,
      discount,
      finalAmount: amount,
    });
  }

  // ✅ Step 5: Create Razorpay order
  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  let order;
  try {
    order = await razorpay.orders.create(options);
    console.log("[Payment] Razorpay order created:", order);
  } catch (err) {
    console.error("[Payment] Razorpay order creation failed:", err);
    return next(new AppError("Failed to create order with Razorpay", 500));
  }

  // ✅ Step 6: Save/update subscription record
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
        amount:amount
      },
      { upsert: true, new: true }
    );
    console.log("[Payment] Subscription record updated:", subscription);
  } catch (err) {
    console.error("[Payment] Subscription DB update failed:", err);
    return next(new AppError("Failed to update subscription", 500));
  }

  // ✅ Step 7: Respond to client
  res.status(200).json({
    status: "success",
    key: process.env.RAZORPAY_KEY_ID,
    planType,
    totalInactiveCourses,
    pricePerCourse: planPrice,
    totalAmount: amount,
    orderId: order.id,
  });

  console.log("[Payment] Order response sent to client");
});


exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // ✅ 1. Verify Razorpay signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    console.log("[Payment Webhook] ❌ Invalid signature received.");
    return res.status(400).json({ status: "error", message: "Invalid signature" });
  }

  const { event, payload } = req.body;

  // ✅ 2. Only handle successful capture event
  if (event !== "payment.captured") {
    console.log("[Payment Webhook] Ignored non-capture event:", event);
    return res.status(200).json({ status: "ignored" });
  }

  const { order_id, id: payment_id, amount } = payload.payment.entity;

  // ✅ 3. Find subscription (minimal projection)
  const subscription = await Subscription.findOne({ razorpayOrderId: order_id })
    .select("status institution planType coupon")
    .lean();

  if (!subscription) {
    console.log(`[Payment Webhook] ⚠️ No subscription found for order_id: ${order_id}`);
    return res.status(200).send("OK");
  }

  // ✅ Idempotency guard
  if (subscription.status === "active") {
    console.log(`[Payment Webhook] ⚠️ Subscription already active for order_id: ${order_id}`);
    return res.status(200).send("OK");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const now = new Date();
    const endDate =
      subscription.planType === "yearly"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    // ✅ Activate subscription
    await Subscription.updateOne(
      { razorpayOrderId: order_id },
      {
        $set: {
          status: "active",
          razorpayPaymentId: payment_id,
          startDate: new Date(),
          endDate,
        },
      },
      { session }
    );

    // ✅ Increment coupon usage if applied
    if (subscription.coupon) {
      await Coupon.updateOne(
        { _id: subscription.coupon },
        { $inc: { useCount: 1 } },
        { session }
      );
      console.log(`[Payment Webhook] 🎟️ Coupon ${subscription.coupon} usage incremented`);
    }

    // ✅ Mark payment done for institute admin
    await InstituteAdmin.updateOne(
      { institution: subscription.institution },
      { $set: { isPaymentDone: true } },
      { session }
    );
    console.log(`[Payment Webhook] ✅ Institute payment marked as done`);

    // ✅ Activate all inactive courses
    const courseUpdateResult = await Course.updateMany(
      {
        institution: subscription.institution,
        status: "Inactive",
      },
      {
        $set: {
          status: "Active",
          courseSubscriptionStartDate: new Date(),
          courseSubscriptionEndDate: endDate,
        },
      },
      { session }
    );

    console.log(
      `[Payment Webhook] ✅ Activated ${courseUpdateResult.modifiedCount} inactive courses for institution ${subscription.institution}`
    );

    // ✅ Cache subscription status
    // await RedisUtil.setex(
    //   `sub_status:${subscription.institution.toString()}`,
    //   3600,
    //   "active"
    // );

    await session.commitTransaction();
    session.endSession();

    console.log(
      `[Payment Webhook] ✅ Subscription + course updates completed successfully for order_id: ${order_id}`
    );

    // ✅ Send email (non-critical, outside session)
    const admin = await InstituteAdmin.findOne({
      institution: subscription.institution,
    })
      .select("name email")
      .lean();

    if (admin?.email) {
      await addPaymentSuccessEmailJob({
        name: admin.name,
        email: admin.email,
        planType: subscription.planType,
        amount: amount / 100, // paise → INR
        orderId: order_id,
        startDate: new Date(),
        endDate,
      });

      console.log(`[Payment Webhook] 📧 Payment success email queued for ${admin.email}`);
    } else {
      console.log(`[Payment Webhook] ⚠️ No email found for institution admin.`);
    }

    return res.status(200).json({ status: "success" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log("[Payment Webhook] ❌ Transaction failed:", err);
    return next(new AppError("Payment verification failed.", 500));
  }
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

exports.getPayableAmount = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const planType = "yearly" // or req.query if you prefer query params

  if (!userId) {
    return res.status(400).json({ status: "error", message: "Missing userId" });
  }

  try {
    // Aggregation: get institution and count inactive courses
    const result = await InstituteAdmin.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "courses",
          let: { institutionId: "$institution" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$institution", "$$institutionId"] },
                    { $eq: ["$status", "Inactive"] },
                  ],
                },
              },
            },
            { $count: "totalInactiveCourses" },
          ],
          as: "courseStats",
        },
      },
      {
        $project: {
          _id: 0,
          totalInactiveCourses: {
            $ifNull: [{ $arrayElemAt: ["$courseStats.totalInactiveCourses", 0] }, 0],
          },
        },
      },
    ]);

    const data = result[0];
    if (!data) {
      return res
        .status(404)
        .json({ status: "error", message: "InstituteAdmin not found" });
    }

    const { totalInactiveCourses } = data;

    // Get price per plan
    const planPrice = PLANS[planType];
    if (!planPrice) {
      return res.status(400).json({
        status: "error",
        message: `Invalid plan type: ${planType}`,
      });
    }

    // Calculate total
    const totalAmount = totalInactiveCourses * planPrice;

    // const totalAmount = 4 * planPrice;

    return res.status(200).json({
      status: "success",
      planType,
      totalInactiveCourses,
      pricePerCourse: planPrice,
      totalAmount,
    });
  } catch (error) {
    console.error("❌ Error in getPayableAmount:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
