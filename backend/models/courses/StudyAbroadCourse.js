const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const StudyAbroadSchema = new mongoose.Schema({
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
  consultancyName: { type: String },
  studentAdmissions: { type: String },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  countries: [
    {
      country: { type: String },
      academicOffering: { type: String },
      budget: { type: Number, min: 0 },
      studentSendTillNow: { type: Number, min: 0 },
    },
  ],
  applicationAssistance: { type: String, enum: ["Yes", "No"] },
  visaProcessingSupport: { type: String, enum: ["Yes", "No"] },
  preDepartureOrientation: { type: String, enum: ["Yes", "No"] },
  accommodationAssistance: { type: String, enum: ["Yes", "No"] },
  educationLoan: { type: String, enum: ["Yes", "No"] },
  postArrivalSupport: { type: String, enum: ["Yes", "No"] },
  partTimeOpportunities: { type: String, enum: ["Yes", "No"] },
  consultancyImageUrl: { type: String },
  imageUrl: { type: String },
  brochureUrl: { type: String },
  businessProofUrl: { type: String },
  panAadhaarUrl: { type: String },
});

// SAVE
StudyAbroadSchema.post("save", async function (doc) {
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
StudyAbroadSchema.post("findOneAndUpdate", async function (doc) {
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
StudyAbroadSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});

const StudyAbroadCourse = mongoose.model(
  "StudyAbroadCourse",
  StudyAbroadSchema,
);
module.exports = StudyAbroadCourse;
