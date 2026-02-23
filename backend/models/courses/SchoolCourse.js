const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const SchoolSchema = new mongoose.Schema({
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
  schoolName: { type: String },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"] },
  courseDuration: { type: String, trim: true, maxlength: 50 },
  startDate: { type: Date },
  classlanguage: { type: String },
  ownershipType: { type: String },
  schoolType: { type: String },
  curriculumType: { type: String },
  openingTime: { type: String },
  closingTime: { type: String },
  openingTimePeriod: { type: String, enum: ["AM", "PM"] },
  closingTimePeriod: { type: String, enum: ["AM", "PM"] },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  classes: [
    { classType: { type: String }, priceOfCourse: { type: Number, min: 0 } },
  ],
  playground: { type: String, enum: ["Yes", "No"] },
  pickupDropService: { type: String, enum: ["Yes", "No"] },
  hostelFacility: { type: String, enum: ["Yes", "No"] },
  emioptions: { type: String, enum: ["Yes", "No"] },
  partlyPayment: { type: String, enum: ["Yes", "No"] },
  schoolPhotoUrl: { type: String },
  schoolImageUrl: { type: String },
  brochureUrl: { type: String },
});

// SAVE
SchoolSchema.post("save", async function (doc) {
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
SchoolSchema.post("findOneAndUpdate", async function (doc) {
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
SchoolSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});

const SchoolCourse = mongoose.model("SchoolCourse", SchoolSchema);
module.exports = SchoolCourse;
