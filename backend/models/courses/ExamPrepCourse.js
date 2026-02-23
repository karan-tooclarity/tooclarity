const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const ExamPrepScema = new mongoose.Schema({
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
  categoriesType: { type: String },
  domainType: { type: String },
  subDomainType: { type: String },
  courseName: { type: String, trim: true, maxlength: 150 },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"] },
  courseDuration: { type: String, trim: true, maxlength: 50 },
  startDate: { type: Date },
  classlanguage: { type: String },
  classSize: { type: String },
  mockTests: { type: String, enum: ["Yes", "No"] },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  priceOfCourse: { type: Number, min: 0 },
  centerImageUrl: { type: String },
  libraryFacility: { type: String, enum: ["Yes", "No"] },
  studyMaterial: { type: String, enum: ["Yes", "No"] },
  installments: { type: String, enum: ["Yes", "No"] },
  emioptions: { type: String, enum: ["Yes", "No"] },
  imageUrl: { type: String },
  brochureUrl: { type: String },
});


// SAVE
ExamPrepScema.post("save", async function (doc) {
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
ExamPrepScema.post("findOneAndUpdate", async function (doc) {
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
ExamPrepScema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});


const ExamPrepCourse = mongoose.model("ExamPrepCourse", ExamPrepScema);
module.exports = ExamPrepCourse;
