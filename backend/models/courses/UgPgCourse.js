const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const UgPgSchema = new mongoose.Schema({
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
  graduationType: {
    type: String,
    enum: ["Under Graduation", "Post Graduation"],
  },
  streamType: { type: String },
  selectBranch: { type: String },
  aboutBranch: { type: String, trim: true },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  educationType: { type: String, enum: ["Full time", "Part time", "Distance"] },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"] },
  classSize: { type: String },
  eligibilityCriteria: { type: String },
  ownershipType: { type: String },
  collegeCategory: { type: String },
  affiliationType: { type: String },
  courseDuration: { type: String, trim: true, maxlength: 50 },
  library: { type: String, enum: ["Yes", "No"] },
  hostelFacility: { type: String, enum: ["Yes", "No"] },
  entranceExam: { type: String, enum: ["Yes", "No"] },
  managementQuota: { type: String, enum: ["Yes", "No"] },
  playground: { type: String, enum: ["Yes", "No"] },
  busService: { type: String, enum: ["Yes", "No"] },
  placementDrives: { type: String, enum: ["Yes", "No"] },
  totalNumberRequires: { type: String },
  highestPackage: { type: String },
  averagePackage: { type: String },
  totalStudentsPlaced: { type: String },
  mockInterviews: { type: String, enum: ["Yes", "No"] },
  resumeBuilding: { type: String, enum: ["Yes", "No"] },
  linkedinOptimization: { type: String, enum: ["Yes", "No"] },
  priceOfCourse: { type: Number, min: 0 },
  centerImageUrl: { type: String },
  installments: { type: String, enum: ["Yes", "No"] },
  emioptions: { type: String, enum: ["Yes", "No"] },
  imageUrl: { type: String },
  brochureUrl: { type: String },
});


// SAVE
UgPgSchema.post("save", async function (doc) {
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
UgPgSchema.post("findOneAndUpdate", async function (doc) {
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
UgPgSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});

const UgPgCourse = mongoose.model("UgPgCourse", UgPgSchema);
module.exports = UgPgCourse;
