import Joi from "joi";

const timeRule = Joi.string()
  .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .required()
  .messages({
    "string.pattern.base": "Time must be in HH:MM (24-hour) format",
    "string.empty": "Time is required",
  });

const operationalDaysOptions = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

export const KindergartenSchema = Joi.object({
  schoolType: Joi.string()
    .valid("Public", "Private (For-profit)", "Private (Non-profit)", "International", "Home - based")
    .required()
    .messages({
      "any.only": "Invalid school type selected",
      "string.empty": "School type is required",
    }),
  curriculumType: Joi.string()
  .trim()
  .min(3)
  .max(100)
  .pattern(/^[A-Za-z\s]+$/) // Only letters and spaces
  .required()
  .messages({
    "string.empty": "Curriculum type is required",
    "string.min": "Curriculum type must be at least 3 characters",
    "string.max": "Curriculum type must not exceed 100 characters",
    "string.pattern.base": "Curriculum type must only contain letters and spaces",
  }),

  openingTime: timeRule,
  closingTime: timeRule,
  operationalDays: Joi.array()
    .items(Joi.string().valid(...operationalDaysOptions))
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one operational day",
      "any.required": "Operational days are required",
    }),
  extendedCare: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Extended Care",
      "string.empty": "Extended Care selection is required",
    }),
  mealsProvided: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Meals Provided",
      "string.empty": "Meals Provided selection is required",
    }),
  outdoorPlayArea: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please choose Yes or No for Outdoor Play Area",
      "string.empty": "Outdoor Play Area selection is required",
    }),
});

export const SchoolSchema = Joi.object({
  schoolType: Joi.string()
    .valid("Co-ed", "Boys Only", "Girls Only")
    .required()
    .messages({
      "any.only": "Invalid school type selected",
      "string.empty": "School type is required",
    }),
  schoolCategory: Joi.string()
    .valid("Public", "Private", "Charter", "International")
    .required()
    .messages({
      "any.only": "Invalid school category selected",
      "string.empty": "School category is required",
    }),
  curriculumType: Joi.string()
    .valid("State Board", "CBSE", "ICSE", "IB", "IGCSE")
    .required()
    .messages({
      "any.only": "Invalid curriculum type selected",
      "string.empty": "Curriculum type is required",
    }),
  operationalDays: Joi.array()
    .items(Joi.string().valid(...operationalDaysOptions))
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one operational day",
      "any.required": "Operational days are required",
    }),
  otherActivities: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      "string.empty": "Other activities is required",
      "string.min": "Other activities must not be empty",
      "string.max": "Other activities must not exceed 200 characters",
    }),
  hostelFacility: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Hostel facility must be Yes or No",
      "string.empty": "Hostel facility selection is required",
    }),
  playground: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Playground must be Yes or No",
      "string.empty": "Playground selection is required",
    }),
  busService: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Bus service must be Yes or No",
      "string.empty": "Bus service selection is required",
    }),
});

export const CollegeSchema = Joi.object({
  collegeType: Joi.string()
    .required()
    .messages({ "string.empty": "College type is required" }),
  collegeCategory: Joi.string()
    .required()
    .messages({ "string.empty": "College category is required" }),
  curriculumType: Joi.string()
    .required()
    .messages({ "string.empty": "Curriculum type is required" }),
  operationalDays: Joi.array()
    .items(Joi.string().valid(...operationalDaysOptions))
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one operational day",
      "any.required": "Operational days are required",
    }),
  otherActivities: Joi.string()
    .trim()
    .max(200)
    .required()
    .messages({
      "string.empty": "Other activities is required",
      "string.max": "Other activities must not exceed 200 characters",
    }),
  hostelFacility: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Hostel facility must be Yes or No",
      "string.empty": "Hostel facility selection is required",
    }),
  playground: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Playground must be Yes or No",
      "string.empty": "Playground selection is required",
    }),
  busService: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Bus service must be Yes or No",
      "string.empty": "Bus Service selection is required",
    }),
});

export const CoachingSchema = Joi.object({
  placementDrives: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for Placement Drives",
      "string.empty": "Placement Drives is required",
    }),
  mockInterviews: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for Mock Interviews",
      "string.empty": "Mock Interviews is required",
    }),
  resumeBuilding: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for Resume Building",
      "string.empty": "Resume Building is required",
    }),
  linkedinOptimization: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for LinkedIn Optimization",
      "string.empty": "LinkedIn Optimization is required",
    }),
  exclusiveJobPortal: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for Exclusive Job Portal access",
      "string.empty": "Exclusive Job Portal is required",
    }),
  certification: Joi.string()
    .valid("Yes", "No")
    .required()
    .messages({
      "any.only": "Please select Yes or No for Certification",
      "string.empty": "Certification is required",
    }),
});


export const StudyAbroadSchema = Joi.object({
  applicationAssistance: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Application Assistance",
    "string.empty": "Application Assistance is required",
  }),
  visaProcessingSupport: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Visa Processing Support",
    "string.empty": "Visa Processing Support is required",
  }),
  testOperation: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Test Operation",
    "string.empty": "Test Operation is required",
  }),
  preDepartureOrientation: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Pre-departure orientation",
    "string.empty": "Pre-departure orientation is required",
  }),
  accommodationAssistance: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Accommodation assistance",
    "string.empty": "Accommodation assistance is required",
  }),
  educationLoans: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Education loans/Financial aid guidance",
    "string.empty": "Education loans/Financial aid guidance is required",
  }),
  postArrivalSupport: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Please select Yes or No for Post-arrival support",
    "string.empty": "Post-arrival support is required",
  }),
});


export const UndergraduateSchema = Joi.object({
    ownershipType: Joi.string()
        // ✅ Updated to match your frontend options
        .valid("Government", "Private", "Semi-Government", "Aided", "Unaided")
        .required()
        .label("Ownership Type")
        .messages({
            "any.only": "Invalid Ownership Type.",
            "string.empty": "Ownership Type is required",
        }),

    collegeCategory: Joi.string()
        // ✅ Updated to match your frontend options
        .valid("Engineering", "Medical", "Arts & Science", "Commerce", "Management", "Law", "Other")
        .required()
        .label("College Category")
        .messages({
            "any.only": "Invalid College Category.",
            "string.empty": "College Category is required",
        }),
        
    affiliationType: Joi.string()
        // ✅ Updated to match your frontend options
        .valid("University", "Autonomous", "Affiliated", "Deemed University", "Other")
        .required()
        .label("Affiliation Type")
        .messages({
            "any.only": "Invalid Affiliation Type.",
            "string.empty": "Affiliation Type is required.",
        }),

    // --- All "Yes/No" fields remain the same ---
    placementDrives: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Placement Drives")
        .messages({
            "any.only": "Please select Yes or No for Placement Drives",
            "string.empty": "Placement Drives is required",
        }),
    mockInterviews: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Mock Interviews")
        .messages({
            "any.only": "Please select Yes or No for Mock Interviews",
            "string.empty": "Mock Interviews is required",
        }),
    resumeBuilding: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Resume Building")
        .messages({
            "any.only": "Please select Yes or No for Resume Building",
            "string.empty": "Resume Building is required",
        }),
    linkedinOptimization: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("LinkedIn Optimization")
        .messages({
            "any.only": "Please select Yes or No for LinkedIn Optimization",
            "string.empty": "LinkedIn Optimization is required",
        }),
    exclusiveJobPortal: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Exclusive Job Portal")
        .messages({
            "any.only": "Please select Yes or No for Exclusive Job Portal access",
            "string.empty": "Exclusive Job Portal is required",
        }),
    library: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Library")
        .messages({
            "any.only": "Please select Yes or No for Library",
            "string.empty": "Library is required",
        }),
    hostelFacility: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Hostel Facility")
        .messages({
            "any.only": "Please select Yes or No for Hostel Facility",
            "string.empty": "Hostel Facility is required",
        }),
    entranceExam: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Entrance Exam")
        .messages({
            "any.only": "Please select Yes or No for Entrance Exam",
            "string.empty": "Entrance Exam is required",
        }),
    managementQuota: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Management Quota")
        .messages({
            "any.only": "Please select Yes or No for Management Quota",
            "string.empty": "Management Quota is required",
        }),
    playground: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Playground")
        .messages({
            "any.only": "Please select Yes or No for Playground",
            "string.empty": "Playground is required",
        }),
    busService: Joi.string()
        .valid("Yes", "No")
        .required()
        .label("Bus Service")
        .messages({
            "any.only": "Please select Yes or No for Bus Service",
            "string.empty": "Bus Service is required",
        }),
});
