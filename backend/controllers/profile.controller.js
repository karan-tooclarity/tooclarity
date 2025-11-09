const mongoose = require('mongoose');
const { addCourseToWishlistJob } = require('../jobs/wishlist.job');
const InstituteAdmin = require("../models/InstituteAdmin");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await InstituteAdmin.findById(req.userId).select("name email contactNumber institution role isProfileCompleted isPaymentDone googleId ProfilePicture address birthday");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User no longer exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        institution: user.institution,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted,
        isPaymentDone: user.isPaymentDone,
        googleId: user.googleId,
        profilePicture: user.ProfilePicture,
        address: user.address,
        birthday: user.birthday,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @description Queues a request to add a course to a student's wishlist.
 *              Responds immediately with 202 Accepted.
 */
exports.addToWishlist = async (req, res, next) => {
    const { courseId } = req.body;
    const userId = req.userId;
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
            success: false,
            message: 'A valid courseId is required.',
        });
    }

    try {
        await addCourseToWishlistJob(userId, courseId);

        return res.status(202).json({
            success: true,
            message: 'Your request to add the course is being processed.',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Fetches the student's current wishlist.
 */
exports.getWishlist = async (req, res, next) => {
    try {
        const userWithWishlist = await InstituteAdmin.findById(req.userId)
            .select('wishlist name email')
            .populate({
                path: 'wishlist',
                select: 'title description instructor'
            });

        if (!userWithWishlist) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            data: userWithWishlist.wishlist,
        });
    } catch (error) {
        next(error);
    }
}