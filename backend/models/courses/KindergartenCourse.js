const mongoose = require("mongoose");
const elasticService = require("../../utils/ElasticSearchUtil");
const { Institution } = require("../Institution");

const KindergartenSchema = new mongoose.Schema({
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

  categoriesType: {
    type: String,
    enum: ["Nursery", "LKG", "UKG", "Playgroup"],
  },

  courseName: { type: String, trim: true, maxlength: 150 },
  aboutCourse: { type: String, trim: true, maxlength: 3000 },
  courseDuration: { type: String, trim: true, maxlength: 50 },
  mode: { type: String, enum: ["Offline", "Online", "Hybrid"] },
  classSize: { type: String },
  priceOfCourse: { type: Number, min: 0 },
  ownershipType: {
    type: String,
    enum: ["Private", "Goverment", "Trust", "Other"],
  },
  locationURL: { type: String, trim: true },
  headquatersAddress: { type: String },
  state: { type: String, trim: true, maxlength: 100 },
  district: { type: String, trim: true, maxlength: 100 },
  town: { type: String, trim: true, maxlength: 100 },
  curriculumType: { type: String },
  openingTime: { type: String },
  closingTime: { type: String },
  openingTimePeriod: { type: String, enum: ["AM", "PM"] },
  closingTimePeriod: { type: String, enum: ["AM", "PM"] },
  operationalDays: [{ type: String }],
  extendedCare: { type: String, enum: ["Yes", "No"] },
  mealsProvided: { type: String, enum: ["Yes", "No"] },
  playground: { type: String, enum: ["Yes", "No"] },
  pickupDropService: { type: String, enum: ["Yes", "No"] },
  emioptions: { type: String, enum: ["Yes", "No"] },
  installments: { type: String, enum: ["Yes", "No"] },
  teacherStudentRatio: { type: String },
  centerImageUrl: { type: String },
  kindergartenImageUrl: { type: String },
  brochureUrl: { type: String },
});

// SAVE
KindergartenSchema.post("save", async function (doc) {
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
KindergartenSchema.post("findOneAndUpdate", async function (doc) {
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
KindergartenSchema.post("findOneAndDelete", async function (doc) {
  try {
    if (!doc) return;
    await elasticService.removeCourse(doc._id);
  } catch (err) {
    console.error("ES delete hook error:", err.message);
  }
});

const KinderCartenCourse = mongoose.model(
  "KindergartenCourse",
  KindergartenSchema,
);
module.exports = KinderCartenCourse;
