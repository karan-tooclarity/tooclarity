const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "instituteType",
  collection: "institutions",
  timestamps: true,
};

const institutionSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: [true, "Institution name is required."],
      trim: true,
    },
    instituteType: {
      type: String,
      required: [true, "Institution type is required."],
      enum: [
        "Kindergarten/childcare center",
        "School's",
        "Intermediate college(K12)",
        "Under Graduation/Post Graduation",
        "Coaching centers",
        "Study Halls",
        "Tution Center's",
        "Study Abroad",
      ],
      index: true,
    },
    establishmentDate: {
      type: String,
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    contactInfo: {
      type: String,
      trim: true,
    },
    additionalContactInfo: {
      type: String,
      trim: true,
    },
    headquartersAddress: {
      type: String,
      required: [true, "Headquarter address is required."],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
      index: true,
    },
    locationURL: {
      type: String,
      trim: true,
    },
    logoUrl:{
        type:String,
        default:""
    },
    institutionAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstituteAdmin",
      required: true,
      index: true,
    },

    // Optional aggregated totals and daily rollups for enquiry types
    callbackLeadsTotal: { type: Number, default: 0 },
    demoLeadsTotal: { type: Number, default: 0 },
    callbackRollups: [
      {
        day: { type: String, trim: true }, // YYYY-MM-DD
        count: { type: Number, default: 0 },
      }
    ],
    demoRollups: [
      {
        day: { type: String, trim: true }, // YYYY-MM-DD
        count: { type: Number, default: 0 },
      }
    ],
  },
  baseOptions
);

const Institution = mongoose.model("Institution", institutionSchema);

const kindergartenSchema = new mongoose.Schema({
  schoolType: {
    type: String,
    required: [true, "School type is required for kindergarten."],
    enum: [
      "Public",
      "Private (For-profit)",
      "Private (Non-profit)",
      "International",
      "Home - based",
    ],
    trim: true,
    default: "",
  },
  curriculumType: {
    type: String,
    required: [true, "Curriculum type is required."],
    trim: true,
    maxlength: [100, "Curriculum type cannot exceed 100 characters."],
    default: "",
    index: true,
  },
  // operationalTimes: {
  //   opening: { type: String, required: true },
  //   closing: { type: String, required: true },
  // },
  closingTime: { type: String, default: "" },
  openingTime: { type: String, default: "" },
  operationalDays: {
    type: [String],
    required: true,
    enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat","Sun"],
    default: [],
  },
  extendedCare: {
    type: Boolean,
    required: true,
    default: false,
  },
  mealsProvided: {
    type: Boolean,
    required: true,
    default: false,
  },
  outdoorPlayArea: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Kindergarten = Institution.discriminator(
  "Kindergarten/childcare center",
  kindergartenSchema
);

const coachingCenterSchema = new mongoose.Schema({
  placementDrives: { type: Boolean, default: false },
  mockInterviews: { type: Boolean, default: false },
  resumeBuilding: { type: Boolean, default: false },
  linkedinOptimization: { type: Boolean, default: false },
  exclusiveJobPortal: { type: Boolean, default: false },
  certification: { type: Boolean, default: false },
});


const CoachingCenter = Institution.discriminator(
  "Coaching centers",
  coachingCenterSchema
);


const schoolSchema = new mongoose.Schema({
  schoolType: {
    type: String,
    required: true,
    enum: ["Co-ed", "Boys Only", "Girls Only"],
    default: "",
  },
  schoolCategory: {
    type: String,
    required: true,
    enum: ["Public", "Private", "Charter", "International"],
    default: "",
  },
  curriculumType: {
    type: String,
    required: true,
    enum: ["State Board", "CBSE", "ICSE", "IB", "IGCSE"],
    default: "",
  },
  operationalDays: {
    type: [String],
    required: true,
    enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
    default: [],
  },
  otherActivities: {
    type: String,
    trim: true,
    maxlength: [500, "Activities description cannot exceed 500 characters."],
    default: "",
  },
  hostelFacility: { type: Boolean, required: true, default: false },
  playground: { type: Boolean, required: true, default: false },
  busService: { type: Boolean, required: true, default: false },
});

const intermediateCollegeSchema = new mongoose.Schema({
  collegeType: {
    type: String,
    required: true,
    enum: [
      "Junior College",
      "Senior College",
      "Senior Secondary",
      "Higher Secondary",
      "Intermediate",
      "Pre-University",
    ],
    default: "",
  },
  collegeCategory: {
    type: String,
    required: true,
    enum: [
      "Private",
      "Government",
      "Semi-Government",
      "Aided",
      "Unaided",
      "Public",
      "Government Aided",
      "Autonomous",
    ],
    default: "",
  },
  curriculumType: {
    type: String,
    required: true,
    enum: ["State Board", "CBSE", "ICSE", "IB", "IGCSE", "Cambridge", "Other"],
    default: "",
    index: true,
  },
  operationalDays: {
    type: [String],
    required: true,
    enum: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
    default: [],
  },
  otherActivities: {
    type: String,
    trim: true,
    maxlength: 500,
    default: "",
  },
  hostelFacility: { type: Boolean, required: true, default: false },
  playground: { type: Boolean, required: true, default: false },
  busService: { type: Boolean, required: true, default: false },
});

// 👇 Use this schema instead
const IntermediateCollege = Institution.discriminator(
  "Intermediate college(K12)",
  intermediateCollegeSchema
);


const School = Institution.discriminator(
  "School's",
  schoolSchema
);


const ugPgUniversitySchema = new mongoose.Schema({
  ownershipType: {
    type: String,
    required: true,
    enum: ["Government", "Private", "Public-Private Partnership"],
    default: "",
  },
  collegeCategory: {
    type: String,
    required: true,
    enum: ["Engineering", "Medical", "Arts & Science", "Management", "Law"],
    default: "",
  },
  affiliationType: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    default: "",
  },

    placementDrives: { type: Boolean, default: false },
    mockInterviews: { type: Boolean, default: false },
    resumeBuilding: { type: Boolean, default: false },
    linkedinOptimization: { type: Boolean, default: false },
    exclusiveJobPortal: { type: Boolean, default: false },
    // certification: { type: Boolean, default: false },
  // --- ✅ ADD THESE MISSING INSTITUTION-WIDE (L3) FIELDS ---
    library: {
        type: Boolean,
        default: false
    },
    hostelFacility: {
        type: Boolean,
        default: false
    },
    entranceExam: {
        type: Boolean,
        default: false
    },
    managementQuota: {
        type: Boolean,
        default: false
    },
    playground: {
        type: Boolean,
        default: false
    },
    busService: {
        type: Boolean,
        default: false
    },
});
const UgPgUniversity = Institution.discriminator(
  "Under Graduation/Post Graduation",
  ugPgUniversitySchema
);

const StudyHalls = Institution.discriminator(
  "Study Halls",
  new mongoose.Schema({}, baseOptions)
);

const TutionCenters = Institution.discriminator(
  "Tution Center's",
  new mongoose.Schema({}, baseOptions)
);

const studyAbroadSchema = new mongoose.Schema({
  consultancyName: {
    type: String,
    required: [true, "Consultancy name is required."],
    trim: true,
  },
  totalAdmissions: {
    type: Number,
    required: [true, "Total student admissions count is required."],
    min: 0,
  },
  countries: {
    type: [String],
    required: [true, "At least one country is required."],
    default: [],
  },
  academicOfferings: {
    type: [String],
    required: [true, "Academic offerings are required."],
    enum: ["Bachelors", "Masters", "PhD", "Diploma", "Certificate Programs", "Graduate", "Undergraduate", "Postgraduate"],
    default: [],
  },
  businessProofUrl: {
    type: String,
    trim: true,
  },
  legalIdUrl: {
    type: String,
    trim: true,
  },
  // L3 Additional Details (Placements-like) for Study Abroad
  applicationAssistance: { type: Boolean, default: false },
  visaProcessingSupport: { type: Boolean, default: false },
  testOperation: { type: Boolean, default: false },
  preDepartureOrientation: { type: Boolean, default: false },
  accommodationAssistance: { type: Boolean, default: false },
  educationLoans: { type: Boolean, default: false },
  postArrivalSupport: { type: Boolean, default: false },
});

const StudyAbroad = Institution.discriminator(
  "Study Abroad",
  studyAbroadSchema
);


module.exports = {
  Institution,
  Kindergarten,
  CoachingCenter,
  // StudyHall,
  School,
  IntermediateCollege,
  UgPgUniversity,
  StudyHalls,
  TutionCenters,
  StudyAbroad
};