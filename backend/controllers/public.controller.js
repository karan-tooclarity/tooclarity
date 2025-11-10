const Course = require("../models/Course");
const asyncHandler = require("express-async-handler");


exports.getAllVisibleCourses = asyncHandler(async (req, res, next) => {
  try {
    const now = new Date();

    const courses = await Course.aggregate([
  // Join with subscriptions to check if the institution has an active subscription
  {
    $lookup: {
      from: "subscriptions",
      let: { institutionId: "$institution" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$institution", "$$institutionId"] },
                { $eq: ["$status", "active"] },
                { $lte: ["$startDate", now] },
                { $gt: ["$endDate", now] }
              ]
            }
          }
        }
      ],
      as: "validSubscription"
    }
  },

  // Only keep courses whose institution has an active subscription
  { $match: { validSubscription: { $ne: [] } } },

  // Join institution details
  {
    $lookup: {
      from: "institutions",
      localField: "institution",
      foreignField: "_id",
      as: "institutionDetails"
    }
  },
  { $unwind: "$institutionDetails" },

  // Select only necessary fields
  {
    $project: {
      _id: 1,
      priceOfCourse: 1,
      courseDuration: 1,
      courseName: 1,
      imageUrl: 1,
      selectBranch:1,

      "institutionDetails._id": 1,
      "institutionDetails.instituteName": 1,
      "institutionDetails.logoUrl": 1,
      "institutionDetails.locationURL": 1
    }
  },

  // Remove temporary field cleanly
  { $unset: "validSubscription" }
]);


    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {
    console.error("❌ [getAllVisibleCourses] Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching visible courses.",
      error: error.message
    });
  }
});