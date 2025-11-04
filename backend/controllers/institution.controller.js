const mongoose = require("mongoose");
const { Institution } = require("../models/Institution");
const asyncHandler = require("express-async-handler");
const logger = require("../config/logger");
const InstituteAdmin = require("../models/InstituteAdmin");
const Branch = require("../models/Branch");
const Course = require("../models/Course");
const { validationResult } = require('express-validator');

/**
 * @desc    CREATE L1 Institution (General Info)
 * @route   POST /api/v1/institutions
 * @access  Private
 */
exports.createL1Institution = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("🚀 Starting L1 Institution creation flow...");
    const user = await InstituteAdmin.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const institutionData = {
      ...req.body,
      institutionAdmin: req.userId,
      instituteType: req.body.instituteType,
    };

    const newInstitution = (
      await Institution.create([institutionData], {
        session,
        validateBeforeSave: false,
      })
    )[0];

    user.institution = newInstitution._id;
    await user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();

    logger.info(
      { userId: req.userId, institutionId: newInstitution._id },
      "L1 institution created successfully."
    );

    return res.status(201).json({
      status: "success",
      message: "L1 completed. Institution created. Please proceed to L2.",
      data: {
        id: newInstitution._id,
        instituteType: newInstitution.instituteType,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error(
      { err: error, userId: req.userId },
      "Error during L1 institution creation transaction."
    );
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: error.message || "Invalid input data",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating institution",
    });
  } finally {
    session.endSession();
  }
});

/**
 * @desc    UPDATE L2 Institution
 * @route   PUT /api/v1/institutions/details
 * @access  Private
 */
exports.updateL2InstitutionDetails = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.userId;
    const institution = await Institution.findOne({ institutionAdmin: userId });
    if (!institution) {
      logger.error({ userId }, "Institution not found for this user");
      return next(new AppError("Institution not found for this user", 404));
    }

    const schemaFields = Object.keys(institution.constructor.schema.paths);
    const updatedFields = {};
    const excludeNumericConversion = [
      "date",
      "establishmentDate",
      "opening",
      "closing",
      "operationalTimes",
    ];

    Object.keys(req.body).forEach((key) => {
      if (
        schemaFields.includes(key) &&
        req.body[key] !== undefined &&
        req.body[key] !== null &&
        req.body[key] !== ""
      ) {
        let value = req.body[key];
        if (
          typeof value === "string" &&
          /^\d+$/.test(value) &&
          !excludeNumericConversion.includes(key)
        ) {
          value = parseInt(value, 10);
        }
        institution[key] = value;
        updatedFields[key] = value;
      }
    });

    const updatedInstitution = await institution.save({
      validateBeforeSave: true,
    });

    res.status(200).json({
      status: "success",
      message: "L2 completed. Institution details updated successfully.",
      data: { institution: updatedInstitution },
    });
  } catch (err) {
    logger.error({ err }, "Error while updating L2 institution details");
    next(err);
  }
});

/**
 * @desc    READ the institution of the logged-in admin
 * @route   GET /api/v1/institutions/me
 * @access  Private
 */
exports.getMyInstitution = asyncHandler(async (req, res, next) => {

  // Try from user document, else by institutionAdmin
  const user = await InstituteAdmin.findById(req.userId).select("institution");
  let institution = null;
  if (user?.institution) {
    institution = await Institution.findById(user.institution);
  } else {
    institution = await Institution.findOne({ institutionAdmin: req.userId });
  }

  if (!institution) {
    return res.status(404).json({
      status: "fail",
      message: "No institution found for this account.",
    });
  }
  res.status(200).json({
    success: true,
    data: institution,
  });
});

/**
 * @desc    DELETE the institution of the logged-in admin
 * @route   DELETE /api/v1/institutions/me
 * @access  Private
 */
exports.deleteMyInstitution = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const institutionId = req.user.institution;
    const institution = await Institution.findById(institutionId).session(session);

    if (!institution) {
      return res.status(404).json({ status: "fail", message: "Institution not found." });
    }

    await institution.remove({ session });

    req.user.institution = undefined;
    await req.user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});


exports.uploadFileData = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded.",
    });
  }

  const institutionAdmin = await InstituteAdmin.findById(req.userId);

  if (!institutionAdmin) {
    return res.status(404).json({
      success: false,
      message: "Institute admin not found",
    });
  }

  // 🚫 If admin already has institution, stop creation
  if (institutionAdmin.institution) {
    return res.status(400).json({
      success: false,
      message:
        "Institution already exists for this admin. Cannot create a new one.",
    });
  }

  // --- Start transaction ---
  const session = await Institution.startSession();
  session.startTransaction();

  try {
    // 1. Parse uploaded file (buffer → JSON)
    const jsonString = file.buffer.toString("utf-8");
    const parsed = JSON.parse(jsonString);

    const { institution, courses } = parsed;

    if (!institution) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Institution data missing",
      });
    }

    institution.institutionAdmin = req.userId;

    // 2. Save institution
    const newInstitution = await Institution.create([institution], { session });
    const institutionId = newInstitution[0]._id;

    // Link institution to admin
    institutionAdmin.institution = institutionId;
    institutionAdmin.isProfileCompleted = true;
    await institutionAdmin.save({ session });

    // --- BULK BRANCH + COURSE HANDLING ---
    let branchDocs = [];
    let branchToCoursesMap = [];
    let directCourses = [];

    const normalizeCoursePayload = (course) => {
      const normalized = { ...course };
      if (!normalized.type) {
        normalized.type = "COURSE";
      }
      if (normalized.brotureUrl && !normalized.brochureUrl) {
        normalized.brochureUrl = normalized.brotureUrl;
        delete normalized.brotureUrl;
      }
      return normalized;
    };

    for (const item of courses || []) {
      if (item.branchName) {
        const { courses: branchCourses, ...branchData } = item;
        branchDocs.push({
          ...branchData,
          institution: institutionId,
        });
        branchToCoursesMap.push(branchCourses || []);
      } else if (item.courses) {
        directCourses.push(
          ...item.courses.map((course) => ({
            ...normalizeCoursePayload(course),
            institution: institutionId,
            branch: null,
          }))
        );
      }
    }

    // Insert branches in bulk
    const insertedBranches =
      branchDocs.length > 0
        ? await Branch.insertMany(branchDocs, { session })
        : [];

    // Collect all courses
    let allCourses = [...directCourses];

    insertedBranches.forEach((branch, index) => {
      const branchCourses = branchToCoursesMap[index];
      if (branchCourses.length > 0) {
        const courseDocs = branchCourses.map((course) => ({
          ...normalizeCoursePayload(course),
          institution: institutionId,
          branch: branch._id,
        }));
        allCourses.push(...courseDocs);
      }
    });

    // Insert courses in bulk
    const insertedCourses =
      allCourses.length > 0
        ? await Course.insertMany(allCourses, { session })
        : [];

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    // ✅ ApiResponse compliant response
    res.status(201).json({
      success: true,
      message: "File processed successfully",
      data: {
        message: "Successfully created institution and associated data",
        isProfileCompleted: true,
      },
    });
  } catch (err) {
    // ❌ Rollback transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error processing file:", err);

    res.status(500).json({
      success: false,
      message: "Failed to process file",
      data: { error: err.message },
    });
  }
});

/**
 * @desc    Filter and find institutions with pagination
 * @route   GET /api/v1/institutions/search
 * @access  Public
 */
exports.filterInstitutions = asyncHandler(async (req, res, next) => {
  // 1. Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const query = {};
  const { instituteType, state, pincode, ...booleanFilters } = req.query;

  if (instituteType) {
    query.instituteType = instituteType;
  }
  if (state) {
    query.state = state;
  }
  if (pincode) {
    query.pincode = pincode;
  }

  // Add boolean filters to the query
  for (const key in booleanFilters) {
    if (booleanFilters[key] === 'true') {
      query[key] = true;
    } else {
      query[key] = false;
    }
  }

  // 3. Execute query
  const institutions = await Institution.find(query)
    .limit(limit)
    .skip(skip)
    .select('-institutionAdmin -__v')
    .lean(); //.lean() gives plain JS objects instead of Mongoose docs, making it faster for read-only ops.

  // 4. Get total count for pagination metadata
  const totalDocuments = await Institution.countDocuments(query);

  logger.info({ filters: query, results: institutions.length }, "Institution search performed.");

  // 5. Send response
  res.status(200).json({
    success: true,
    count: institutions.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
      totalInstitutions: totalDocuments,
    },
    data: institutions,
  });
});