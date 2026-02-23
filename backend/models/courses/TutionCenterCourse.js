const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const TutionCenterSchema = new mongoose.Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
    index: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: false,
    index: true,
  },
  courseType: { type: String }, // Stores category like "Coaching centers", "Study Abroad", etc.
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
  courseSubscriptionStartDate: { type: Date },
  courseSubscriptionEndDate: { type: Date },

  listingType: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  tutionCenterName: { type: String },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"] },
  operationalDays: [{ type: String }],
  openingTime: { type: String },
  closingTime: { type: String },
  openingTimePeriod: { type: String, enum: ["AM", "PM"] },
  closingTimePeriod: { type: String, enum: ["AM", "PM"] },
  subject: { type: String },
  classSize: { type: String },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  subjectOffer: [
    {
      subject: { type: String },
      classTiming: { type: String },
      specialization: { type: String },
      fee: { type: Number },
    },
  ],
  faculty: [
    {
      facultyName: { type: String },
      experience: { type: Number },
      qualifications: { type: String },
      subjectYouTeach: { type: String },
    },
  ],
  partlyPayment: { type: String, enum: ["Yes", "No"] },
  campusImage: { type: String },
  imageUrl: { type: String },
  brochureUrl: { type: String },
});

// SAVE
TutionCenterSchema.post("save", async function (doc) {
  try {
    if (doc.status !== "Active") {
      // If saved as inactive, ensure it's removed from ES
      await elasticService.removeCourse(doc._id);
      return;
    }

    const institution = await Institution.findById(doc.institution).lean();
    await elasticService.indexCourse(doc, institution);
  } catch (err) {
    console.error("ES save hook error:", err.message);
  }
});

// UPDATE
TutionCenterSchema.post("findOneAndUpdate", async function (doc) {
  try {
    if (!doc) return;
    
    if (doc.status !== "Active") {
      await elasticService.removeCourse(doc._id);
      return;
    }
    
    const institution = await Institution.findById(doc.institution).lean();
    await elasticService.indexCourse(doc, institution);
  } catch (err) {
    console.error("ES update hook error:", err.message);
  }
});

// DELETE
TutionCenterSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});

const TutionCenterCourse = mongoose.model(
  "TutionCenterCourse",
  TutionCenterSchema,
);
module.exports = TutionCenterCourse;
