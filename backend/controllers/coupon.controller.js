// controllers/coupon.controller.js

const Coupon = require("../models/coupon");
// const Admin = require("../models/Admin"); // Import the new Admin model
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const InstitutionAdmin = require("../models/InstituteAdmin");
const { Institution } = require("../models/Institution");
const Course = require("../models/Course");

const PLANS = require("../config/plans");

exports.createCoupon = asyncHandler(async (req, res, next) => {
  const { code, discountedPercentage, planType, maxUses } = req.body;

  const adminId = req.userId;

  if (!adminId) {
    return next(new AppError("Admin ID is required to create a coupon", 400));
  }

  if (!PLANS[planType]) {
    return next(new AppError("Invalid plan type", 400));
  }

  // if (!Array.isArray(institutionIds) || institutionIds.length === 0) {
  //   return next(new AppError("At least one institution is required", 400));
  // }

  let validTill = new Date();
  if (planType === "yearly") {
    validTill.setFullYear(validTill.getFullYear() + 1);
  } else if (planType === "monthly") {
    validTill.setMonth(validTill.getMonth() + 1);
  } else {
    return next(new AppError("Unsupported plan type for coupon", 400));
  }

  try {
    const coupon = await Coupon.create({
      code,
      discountPercentage: discountedPercentage,
      // institutions: institutionIds,
      maxUses,
      validTill,
      planType,
      createdBy: adminId,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("A coupon with this code already exists.", 409));
    }
    if (err.name === "ValidationError") {
      return next(new AppError(err.message, 400));
    }
    console.error("[Coupon] Creation failed:", err);
    return next(new AppError("Failed to create coupon", 500));
  }
});

/**
 * @desc    Validate a coupon
 * @route   POST /api/v1/coupon/apply
 * @access  Private/InstitutionAdmin
 */

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code, planType = "yearly" } = req.body;
  const userId = req.userId;

  if (!userId) {
    return next(new AppError("Missing userId in request", 400));
  }

  // ✅ Step 1: Get institution from InstituteAdmin
  const admin = await InstitutionAdmin.findById(userId).select("institution");
  if (!admin || !admin.institution) {
    return next(new AppError("Institution not found for this user", 404));
  }

  const institutionId = admin.institution;

  // ✅ Step 2: Find and validate coupon
  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    return next(new AppError("Invalid or expired coupon", 404));
  }

  if (coupon.validTill && new Date(coupon.validTill) < new Date()) {
    return next(new AppError("Coupon has expired", 400));
  }

  // ✅ Step 3: Count total inactive courses for that institution
  const totalInactiveCourses = await Course.countDocuments({
    institution: institutionId,
    status: "Inactive",
  });

  // ✅ Step 4: Calculate plan price
  const planPrice = PLANS[planType];
  if (!planPrice) {
    return next(new AppError("Invalid plan type specified", 400));
  }

  // ✅ Step 5: Compute total amount and apply discount
  const totalBeforeDiscount = totalInactiveCourses * planPrice;
  const discountAmount = (totalBeforeDiscount * coupon.discountPercentage) / 100;
  const totalAfterDiscount = Math.max(totalBeforeDiscount - discountAmount, 0);

  // ✅ Step 6: Send clean, idempotent response (no DB writes)
  return res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: {
      discountAmount: discountAmount,
    },
  });
});

exports.listInstitutions = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [{ instituteName: { $regex: search, $options: "i" } }];
    }

    // Query DB (select only _id and instituteName)
    const [institutions, total] = await Promise.all([
      Institution.find(filter)
        .select("_id instituteName")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Institution.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Institutions fetched successfully",
      data: {
        institutions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
