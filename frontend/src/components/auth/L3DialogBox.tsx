"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
  _DialogDescription,
  _DialogTrigger,
} from "@/components/ui/dialog";
import {
  _Card,
  _CardHeader,
  _CardTitle,
  _CardDescription,
  _CardContent,
  _CardFooter,
} from "@/components/ui/card";
// import InputField from "@/components/ui/InputField";
// import { Clock } from "lucide-react";
// import { institutionDetailsAPI, clearInstitutionData } from "@/lib/api";
// import { validateField, validateForm } from "@/lib/validations/validateField";
import {
  KindergartenSchema,
  SchoolSchema,
  CoachingSchema,
  CollegeSchema,
  UndergraduateSchema,
  StudyAbroadSchema,
} from "@/lib/validations/L3Schema";
import {
  addInstitutionToDB,
  getAllInstitutionsFromDB,
  updateInstitutionInDB,
} from "@/lib/localDb";
import {
  exportAndUploadInstitutionAndCourses,
  // exportInstitutionAndCoursesToFile,
} from "@/lib/utility";
import { validateField, validateForm } from "@/lib/validations/validateField";


// ✅ 1. Import all your specific form components
import KindergartenForm from "./L3DialogBoxParts/KindergartenForm";
import SchoolForm from "./L3DialogBoxParts/SchoolForm";
import CollegeForm from "./L3DialogBoxParts/CollegeForm";
import CoachingForm from "./L3DialogBoxParts/CoachingForm";
import UndergraduateForm from "./L3DialogBoxParts/UndergraduateForm";
import StudyAbroadForm from "./L3DialogBoxParts/StudyAbroadForm";

interface KindergartenFormData extends Record<string, unknown> {
  schoolType: string;
  curriculumType: string;
  openingTime: string;
  closingTime: string;
  operationalDays: string[];
  extendedCare: string;
  mealsProvided: string;
  outdoorPlayArea: string;
}

interface L3DialogBoxProps {
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onPrevious?: () => void; // 👈 add this
}

interface _InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  isSelect?: boolean;
  isRadio?: boolean;
  options?: string[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  error?: string;
}
interface _InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  options?: string[];
  isSelect?: boolean;
  isRadio?: boolean;
  isTextarea?: boolean;
  rows?: number;
  error?: string;
}

interface FormData {
  schoolType: string;
  curriculumType: string;
  openingTime: string;
  closingTime: string;
  operationalDays: string[];
  extendedCare: string;
  mealsProvided: string;
  outdoorPlayArea: string;
}

interface SchoolFormData {
  schoolType: string;
  schoolCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
}

interface CoachingFormData {
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  certification: string;
}

interface IntermediateFormData {
  collegeType: string;
  collegeCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
}

interface UndergraduateFormData {
  ownershipType: string;
  collegeCategory: string;
  affiliationType: string;
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  library: string;
  hostelFacility: string;
  entranceExam: string;
  managementQuota: string;
  playground: string;
  busService: string;
}

export default function L3DialogBox({
  trigger,
  open,
  onOpenChange,
  onSuccess,
  onPrevious,
}: L3DialogBoxProps) {
  const router = useRouter();
  // const [institutionType, setInstitutionType] = useState<string | null>(null);const response = await courseAPI.createCourses(courses);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle controlled open state
  const DialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  
  let institutionType: string | null = null;
  // const institutionType = localStorage.getItem("institutionType");
  if (typeof window !== "undefined") {
    institutionType = localStorage.getItem("institutionType");
  }
  // Check institution types - default to kindergarten if no type is set
  const isKindergarten =
    institutionType === "Kindergarten/childcare center" ||
    institutionType === null;
  const isSchool = institutionType === "School's";
  const isCoaching = institutionType === "Coaching centers";
  const isIntermediate = institutionType === "Intermediate college(K12)";
  const isUndergraduate =
    institutionType === "Under Graduation/Post Graduation";
  const isStudyAbroad = institutionType === "Study Abroad";

  useEffect(() => {
    if (!DialogOpen) return;

    let isMounted = true;
    (async () => {
      try {
        const institutions = await getAllInstitutionsFromDB();
        if (!isMounted) return;

        if (institutions && institutions.length > 0) {
          const latest = institutions.sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
          )[0];
          setFormData({
            schoolType: latest.schoolType || "",
            curriculumType: latest.curriculumType || "",
            openingTime: latest.openingTime || "",
            closingTime: latest.closingTime || "",
            operationalDays: latest.operationalDays || [],
            extendedCare: latest.extendedCare || "",
            mealsProvided: latest.mealsProvided || "",
            outdoorPlayArea: latest.outdoorPlayArea || "",
          });
        } else {
          // ensure blank state
          setFormData({
            schoolType: "",
            curriculumType: "",
            openingTime: "",
            closingTime: "",
            operationalDays: [],
            extendedCare: "",
            mealsProvided: "",
            outdoorPlayArea: "",
          });
        }
      } catch (err) {
        console.error("Failed to load institutions from IndexedDB", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [DialogOpen]);

  const [formData, setFormData] = useState<KindergartenFormData>({
    schoolType: "",
    curriculumType: "",
    openingTime: "",
    closingTime: "",
    operationalDays: [],
    extendedCare: "",
    mealsProvided: "",
    outdoorPlayArea: "",
  });

  const [schoolFormData, setSchoolFormData] = useState<SchoolFormData>({
    schoolType: "",
    schoolCategory: "",
    curriculumType: "",
    operationalDays: [],
    otherActivities: "",
    hostelFacility: "",
    playground: "",
    busService: "",
  });

  const [coachingFormData, setCoachingFormData] = useState<CoachingFormData>({
    placementDrives: "",
    mockInterviews: "",
    resumeBuilding: "",
    linkedinOptimization: "",
    exclusiveJobPortal: "",
    certification: "",
  });

  const [collegeFormData, setCollegeFormData] = useState<IntermediateFormData>({
    collegeType: "",
    collegeCategory: "",
    curriculumType: "",
    operationalDays: [],
    otherActivities: "",
    hostelFacility: "",
    playground: "",
    busService: "",
  });

  const [undergraduateFormData, setUndergraduateFormData] =
    useState<UndergraduateFormData>({
      ownershipType: "",
      collegeCategory: "",
      affiliationType: "",
      placementDrives: "",
      mockInterviews: "",
      resumeBuilding: "",
      linkedinOptimization: "",
      exclusiveJobPortal: "",
      library: "",
      hostelFacility: "",
      entranceExam: "",
      managementQuota: "",
      playground: "",
      busService: "",
    });

  const [studyAbroadFormData, setStudyAbroadFormData] = useState({
    applicationAssistance: "",
    visaProcessingSupport: "",
    testOperation: "",
    preDepartureOrientation: "",
    accommodationAssistance: "",
    educationLoans: "",
    postArrivalSupport: "",
  });
  const [studyAbroadFormErrors, setStudyAbroadFormErrors] = useState<any>({});

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [schoolFormErrors, setSchoolFormErrors] = useState<
    Partial<Record<keyof SchoolFormData, string>>
  >({});
  const [coachingFormErrors, setCoachingFormErrors] = useState<
    Partial<Record<keyof CoachingFormData, string>>
  >({});
  const [collegeFormErrors, setCollegeFormErrors] = useState<
    Partial<Record<keyof IntermediateFormData, string>>
  >({});
  const [undergraduateFormErrors, setUndergraduateFormErrors] = useState<
    Partial<Record<keyof UndergraduateFormData, string>>
  >({});

  // ---------- Handlers ----------
  const handleStudyAbroadRadioChange = (name: string, value: string) => {
    setStudyAbroadFormData((prev: any) => ({ ...prev, [name]: value }));
    const error = validateField(StudyAbroadSchema, name as any, value);
    setStudyAbroadFormErrors((prev: any) => ({ ...prev, [name]: error || "" }));
  };


  const handleSchoolFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Update state
    setSchoolFormData((prev) => ({ ...prev, [name]: value }));

    // Dynamic validation
    const error = validateField(SchoolSchema, name, value);
    setSchoolFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };
  const handleSchoolRadioChangeWithValidation = (
    name: keyof SchoolFormData,
    value: string
  ) => {
    setSchoolFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(SchoolSchema, name, value);
    setSchoolFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleSchoolOperationalDayToggle = (day: string) => {
    setSchoolFormData((prev) => {
      const updatedDays = prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day];

      // Validate array
      const error = validateField(SchoolSchema, "operationalDays", updatedDays);
      setSchoolFormErrors((prev) => ({
        ...prev,
        operationalDays: error || "",
      }));

      return { ...prev, operationalDays: updatedDays };
    });
  };
  
const handleSchoolSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validate with Joi
  const errors = validateForm(SchoolSchema, schoolFormData as unknown as Record<string, unknown>);
  setSchoolFormErrors(errors);
  if (Object.keys(errors).length > 0) return;

  setIsLoading(true);

  try {
    const schoolFormDataWithBooleans = {
      ...schoolFormData,
      hostelFacility: schoolFormData.hostelFacility === "Yes",
      playground: schoolFormData.playground === "Yes",
      busService: schoolFormData.busService === "Yes",
    };

    const schools = await getAllInstitutionsFromDB?.();

    const normalize = (x: import("@/lib/localDb").InstitutionRecord | Record<string, unknown>) => ({
      schoolType: x.schoolType || "",
      schoolCategory: x.schoolCategory || "",
      curriculumType: x.curriculumType || "",
      operationalDays: x.operationalDays || [],
      otherActivities: x.otherActivities || "",
      hostelFacility: !!x.hostelFacility,
      playground: !!x.playground,
      busService: !!x.busService,
    });

    const latest =
      schools && schools.length > 0
        ? schools.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
        : undefined;

    const current = normalize(schoolFormDataWithBooleans) as import("@/lib/localDb").InstitutionRecord;
    let effectiveId: string | null = null;

    if (latest) {
      const latestNormalized = normalize(latest);
      const isSame =
        JSON.stringify(latestNormalized) === JSON.stringify(current);

      if (isSame) {
        effectiveId = latest.id || null;
      } else{
          const mergedInstitution: import("@/lib/localDb").InstitutionRecord = {
            ...latest,
            ...current,
      };
        await updateInstitutionInDB(mergedInstitution);
        effectiveId = latest.id || null;
      }
    } else {
      const id = await addInstitutionToDB(current as import("@/lib/localDb").InstitutionRecord);
      effectiveId = id;
      console.log("School saved locally with id:", id);
    }

    if (typeof window !== "undefined" && effectiveId !== null) {
      localStorage.setItem("institutionId", String(effectiveId));
    }

    const uploadResponse = await exportAndUploadInstitutionAndCourses();
    console.log("Upload response:", uploadResponse);

    setDialogOpen(false);
    setSchoolFormErrors({});
    onSuccess?.();
    
  } catch (error) {
    console.error("Error saving school details:", error);
    alert("Failed to save school details locally. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleCollegeFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update college form data
    setCollegeFormData((prev) => ({ ...prev, [name]: value }));

    // Dynamic validation
    const error = validateField(CollegeSchema, name, value);
    setCollegeFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleCollegeOperationalDayToggle = (day: string) => {
    setCollegeFormData((prev) => {
      const updatedDays = prev.operationalDays.includes(day)
        ? prev.operationalDays.filter((d) => d !== day)
        : [...prev.operationalDays, day];

      // Validate array
      const error = validateField(
        CollegeSchema,
        "operationalDays",
        updatedDays
      );
      setCollegeFormErrors((prev) => ({
        ...prev,
        operationalDays: error || "",
      }));

      return { ...prev, operationalDays: updatedDays };
    });
  };
  const handleCollegeRadioChangeWithValidation = (
    name: keyof IntermediateFormData,
    value: string
  ) => {
    setCollegeFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(CollegeSchema, name, value);
    setCollegeFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleCollegeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setSubmitted(true);

    // ✅ Validate form
    const errors = validateForm(CollegeSchema, collegeFormData as unknown as Record<string, unknown>);
    setCollegeFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

  try {
    const collegeFormDataWithBooleans = {
      ...collegeFormData,
      hostelFacility: collegeFormData.hostelFacility === "Yes",
      playground: collegeFormData.playground === "Yes",
      busService: collegeFormData.busService === "Yes",
    };

      // 1) Load existing colleges from IndexedDB
      const colleges = await getAllInstitutionsFromDB?.(); // 🔑 need to implement in localDb.ts

      // Normalize for comparison
      const normalize = (x: import("@/lib/localDb").InstitutionRecord | Record<string, unknown>) => ({
        collegeType: (x.collegeType as string) || "",
        collegeCategory: (x.collegeCategory as string)|| "",
        curriculumType: (x.curriculumType as string) || "",
        operationalDays: (x.operationalDays as string[]) || "",
        otherActivities: ( x.otherActivities as string) || "",
        hostelFacility: !!x.hostelFacility,
        playground: !!x.playground,
        busService: !!x.busService,
      });

      const latest =
        colleges && colleges.length > 0
          ? colleges.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
          : undefined;

      const current = normalize(collegeFormDataWithBooleans);
      let effectiveId: string | null = null;

      if (latest) {
        const latestNormalized = normalize(latest);
        const isSame =
          JSON.stringify(latestNormalized) === JSON.stringify(current);

        if (isSame) {
          // ✅ unchanged → skip saving
          effectiveId = latest.id || null;
        }
        else{
          const mergedInstitution: import("@/lib/localDb").InstitutionRecord = {
            ...current,
            ...latest,
        };
          await updateInstitutionInDB(mergedInstitution);
          effectiveId = latest.id || null;
        }
      } else {
        // ✅ insert new
        const id = await addInstitutionToDB(current as import("@/lib/localDb").InstitutionRecord);
        effectiveId = id;
        console.log("College saved locally with id:", id);
      }

      // 2) Save reference in localStorage (optional)
      if (typeof window !== "undefined") {
        if (effectiveId !== null) {
          localStorage.setItem("collegeId", String(effectiveId));
        }
      }

      const response = await exportAndUploadInstitutionAndCourses();
      console.log("Upload response:", response);

      if (response.success) {
        // 3) Success → reset + redirect
        setDialogOpen(false);
        //   setSubmitted(false);
        setCollegeFormErrors({});
        setCollegeFormData({
          collegeType: "",
          collegeCategory: "",
          curriculumType: "",
          operationalDays: [],
          otherActivities: "",
          hostelFacility: "",
          playground: "",
          busService: "",
        });

        router.push("/payment");
        onSuccess?.();
      } else {
        alert(
          response.message ||
            "Failed to save college details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving college details locally:", error);
      alert("Failed to save college details locally. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoachingSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

    const errors = validateForm(CoachingSchema, coachingFormData as unknown as Record<string, unknown>);
  setCoachingFormErrors(errors);

  if (errors && Object.keys(errors).length > 0) return;

  setIsLoading(true);

  try {
    const coachingFormDataWithBooleans = {
      ...coachingFormData,
      placementDrives: coachingFormData.placementDrives === "Yes",
      mockInterviews: coachingFormData.mockInterviews === "Yes",
      resumeBuilding: coachingFormData.resumeBuilding === "Yes",
      linkedinOptimization: coachingFormData.linkedinOptimization === "Yes",
      exclusiveJobPortal: coachingFormData.exclusiveJobPortal === "Yes",
      certification: coachingFormData.certification === "Yes",
    };

    const coachings = await getAllInstitutionsFromDB?.();

    const normalize = (x: import("@/lib/localDb").InstitutionRecord | Record<string, unknown>) => ({
      placementDrives: !!x.placementDrives,
      mockInterviews: !!x.mockInterviews,
      resumeBuilding: !!x.resumeBuilding,
      linkedinOptimization: !!x.linkedinOptimization,
      exclusiveJobPortal: !!x.exclusiveJobPortal,
      certification: !!x.certification,
    });

    const latest =
      coachings && coachings.length > 0
        ? coachings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
        : undefined;

    const current = normalize(coachingFormDataWithBooleans);
    let effectiveId: string | null = null;

    if (latest) {
      const latestNormalized = normalize(latest);
      const isSame =
        JSON.stringify(latestNormalized) === JSON.stringify(current);

      if (isSame) {
        effectiveId = latest.id || null;
      } else{
          const mergedInstitution: import("@/lib/localDb").InstitutionRecord = {
            ...latest,
            ...current,
        };
        await updateInstitutionInDB(mergedInstitution);
        effectiveId = latest.id || null;
      }
    } else {
      const id = await addInstitutionToDB(current as import("@/lib/localDb").InstitutionRecord);
      effectiveId = id;
      console.log("Coaching center saved locally with id:", id);
    }

    if (typeof window !== "undefined") {
      if (effectiveId !== null) {
        localStorage.setItem("coachingId", String(effectiveId));
      }
    }

    const response = await exportAndUploadInstitutionAndCourses();
    console.log("Upload response:", response);

    if (response.success) {
      setDialogOpen(false);
      setCoachingFormErrors({});
      setCoachingFormData({
        placementDrives: "",
        mockInterviews: "",
        resumeBuilding: "",
        linkedinOptimization: "",
        exclusiveJobPortal: "",
        certification: "",
      });
      
      // ✅ Call the onSuccess callback and navigate to the payment page
      onSuccess?.(); 
      router.push("/payment");

    } else {
      alert(response?.message || "Failed to save coaching center details. Please try again.");
    }
  } catch (error) {
    console.error("Error saving coaching center details:", error);
    alert("Failed to save coaching center details. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleUndergraduateChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  // Update form data
  setUndergraduateFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Validate the single field against the UndergraduateSchema
  const fieldSchema = UndergraduateSchema.extract(name);
  const { error } = fieldSchema.validate(value);

  // Update errors: clear if valid
  setUndergraduateFormErrors((prev) => ({
    ...prev,
    [name]: error ? error.message : "",
  }));
};



const handleUndergraduateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // 1. Validate the form data with Joi
  const { error } = UndergraduateSchema.validate(undergraduateFormData, { abortEarly: false });
  
  if (error) {
    // If there are errors, map them to the state and stop the submission
    const errors: Record<string, string> = {};
    error.details.forEach((detail) => {
      const fieldName = detail.path[0] as string;
      errors[fieldName] = detail.message;
    });
    setUndergraduateFormErrors(errors);
    return; // Stop the function here
  }

  // If validation passes, clear any existing errors and proceed
  setUndergraduateFormErrors({});
  setIsLoading(true);

  try {
    // 2. Normalize the "Yes"/"No" string values to booleans
    const formDataWithBooleans = {
      ...undergraduateFormData,
      placementDrives: undergraduateFormData.placementDrives === "Yes",
      mockInterviews: undergraduateFormData.mockInterviews === "Yes",
      resumeBuilding: undergraduateFormData.resumeBuilding === "Yes",
      linkedinOptimization: undergraduateFormData.linkedinOptimization === "Yes",
      exclusiveJobPortal: undergraduateFormData.exclusiveJobPortal === "Yes",
      library: undergraduateFormData.library === "Yes",
      hostelFacility: undergraduateFormData.hostelFacility === "Yes",
      entranceExam: undergraduateFormData.entranceExam === "Yes",
      managementQuota: undergraduateFormData.managementQuota === "Yes",
      playground: undergraduateFormData.playground === "Yes",
      busService: undergraduateFormData.busService === "Yes",
    };
    
    // 3. Prepare a function to normalize data for DB comparison
    const normalize = (data: import("@/lib/localDb").InstitutionRecord | Record<string, unknown>) => ({
      ownershipType: data.ownershipType || "",
      collegeCategory: data.collegeCategory || "",
      affiliationType: data.affiliationType || "",
      placementDrives: !!data.placementDrives,
      mockInterviews: !!data.mockInterviews,
      resumeBuilding: !!data.resumeBuilding,
      linkedinOptimization: !!data.linkedinOptimization,
      exclusiveJobPortal: !!data.exclusiveJobPortal,
      library: !!data.library,
      hostelFacility: !!data.hostelFacility,
      entranceExam: !!data.entranceExam,
      managementQuota: !!data.managementQuota,
      playground: !!data.playground,
      busService: !!data.busService,
    });
    
    const currentData = normalize(formDataWithBooleans) as import("@/lib/localDb").InstitutionRecord;
    let effectiveId: string | null = null;
    
    // 4. Load existing data and decide whether to update or add a new entry
    const institutions = await getAllInstitutionsFromDB();
    const latestInstitution = (institutions && institutions.length > 0)
      ? institutions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
      : undefined;

    if (latestInstitution) {
      const latestNormalized = normalize(latestInstitution);
      const isSame = JSON.stringify(latestNormalized) === JSON.stringify(currentData);

      if (isSame) {
        effectiveId = latestInstitution.id || null;
      } else{
        const mergerdInstitution: import("@/lib/localDb").InstitutionRecord = {
          ...latestInstitution,
          ...currentData,
        }

        await updateInstitutionInDB(mergerdInstitution);
        effectiveId = latestInstitution.id || null;
      }
    } else {
      const newId = await addInstitutionToDB({
        ...(currentData as import("@/lib/localDb").InstitutionRecord),
        createdAt: Date.now(),
      });
      effectiveId = newId;
      console.log("Undergraduate details saved locally with id:", newId);
    }
    
    // 5. Save reference to localStorage and upload the data
    if (typeof window !== "undefined" && effectiveId !== null) {
      localStorage.setItem("institutionId", String(effectiveId));
    }
    
    const response = await exportAndUploadInstitutionAndCourses();
    console.log("Upload response:", response);

    if (response.success) {
      // 6. On successful upload, reset the form and redirect
      setDialogOpen(false);
      onSuccess?.();

      setUndergraduateFormData({ // Reset form to initial state
        ownershipType: "",
        collegeCategory: "",
        affiliationType: "",
        placementDrives: "",
        mockInterviews: "",
        resumeBuilding: "",
        linkedinOptimization: "",
        exclusiveJobPortal: "",
        library: "",
        hostelFacility: "",
        entranceExam: "",
        managementQuota: "",
        playground: "",
        busService: "",
      });

      router.push("/payment");
    } else {
      alert(response.message || "Failed to save undergraduate details.");
    }
  } catch (err) {
    console.error("Error saving undergraduate details:", err);
    alert("Failed to save undergraduate details locally. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  // Use the same handler for radios
  const handleUndergraduateRadioChange = handleUndergraduateChange;

  const operationalDaysOptions = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field
    const error = validateField(KindergartenSchema, name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  // Handle radio button change
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(KindergartenSchema, name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  // Handle operational days toggle
  const handleOperationalDayChange = (day: string) => {
    const updatedDays = formData.operationalDays.includes(day)
      ? formData.operationalDays.filter((d) => d !== day)
      : [...formData.operationalDays, day];

    setFormData((prev) => ({ ...prev, operationalDays: updatedDays }));

    const error = validateField(
      KindergartenSchema,
      "operationalDays",
      updatedDays
    );
    setFormErrors((prev) => ({ ...prev, operationalDays: error || "" }));
  };

  const handleCoachingFieldChange = (
    name: keyof CoachingFormData,
    value: string
  ) => {
    setCoachingFormData((prev) => ({ ...prev, [name]: value }));

    // Validate single field dynamically
    const error = validateField(CoachingSchema, name, value);
    setCoachingFormErrors((prev) => ({ ...prev, [name]: error || "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate with Joi
    const errors = validateForm(KindergartenSchema, formData as unknown as Record<string, unknown>);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);

    try {
      // ✅ Normalize Yes/No → booleans
      const formDataWithBooleans = {
        ...formData,
        extendedCare: formData.extendedCare === "Yes",
        mealsProvided: formData.mealsProvided === "Yes",
        outdoorPlayArea: formData.outdoorPlayArea === "Yes",
      };

      // 1) Load existing institutions
      const institutions = await getAllInstitutionsFromDB();
      const latest =
        institutions && institutions.length > 0
          ? institutions.sort(
              (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
            )[0]
          : null;

      // Normalize for comparison
      const normalize = (x: import("@/lib/localDb").InstitutionRecord | Record<string, unknown>): import("@/lib/localDb").InstitutionRecord => ({
        schoolType: (x.schoolType as string) || "",
        curriculumType: (x.curriculumType as string) || "",
        openingTime: (x.openingTime as string) || "",
        closingTime: (x.closingTime as string) || "",
        operationalDays: (x.operationalDays as string[]) || [],
        extendedCare: (x.extendedCare as string) || "",
        mealsProvided: (x.mealsProvided as string) || "",
        outdoorPlayArea: (x.outdoorPlayArea as string) || "",
      });

      const current = normalize(formDataWithBooleans) as import("@/lib/localDb").InstitutionRecord ;
      let effectiveId: string | null = null;

      if (latest) {
        const latestNormalized = normalize(latest);
        const isSame =
          JSON.stringify(latestNormalized) === JSON.stringify(current);

        if (isSame) {
          effectiveId = latest.id || null; // no changes
        } else{
          const mergerdInstitution: import("@/lib/localDb").InstitutionRecord = {
            ...latest,
            ...current,
          }

          await updateInstitutionInDB(mergerdInstitution);
          effectiveId = latest.id || null;
        }
      } else {
        // ✅ insert new
        const id = await addInstitutionToDB({
          ...(current as import("@/lib/localDb").InstitutionRecord),
          createdAt: Date.now(),
        });
        effectiveId = id;
        console.log("Kindergarten saved locally with id:", id);
      }

      // 2) Save reference in localStorage
      if (typeof window !== "undefined" && effectiveId !== null) {
        localStorage.setItem("institutionId", String(effectiveId));
      }

      // 3) Export + upload
      const response = await exportAndUploadInstitutionAndCourses();
      console.log("Upload response:", response);

      if (response.success) {
        // ✅ success → reset and redirect
        setDialogOpen(false);
        onSuccess?.();

        setFormData({
          schoolType: "",
          curriculumType: "",
          openingTime: "",
          closingTime: "",
          operationalDays: [],
          extendedCare: "",
          mealsProvided: "",
          outdoorPlayArea: "",
        });

        router.push("/payment");
      } else {
        alert(response.message || "Failed to save kindergarten details.");
      }
    } catch (error) {
      console.error("Error saving kindergarten details:", error);
      alert("Failed to save kindergarten details locally. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudyAbroadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm(StudyAbroadSchema, studyAbroadFormData);
    if (Object.keys(errors).length > 0) {
      setStudyAbroadFormErrors(errors as any);
      return;
    }
    setIsLoading(true);
    try {
      // Normalize Yes/No → booleans
      const normalized = {
        applicationAssistance: studyAbroadFormData.applicationAssistance === "Yes",
        visaProcessingSupport: studyAbroadFormData.visaProcessingSupport === "Yes",
        testOperation: studyAbroadFormData.testOperation === "Yes",
        preDepartureOrientation: studyAbroadFormData.preDepartureOrientation === "Yes",
        accommodationAssistance: studyAbroadFormData.accommodationAssistance === "Yes",
        educationLoans: studyAbroadFormData.educationLoans === "Yes",
        postArrivalSupport: studyAbroadFormData.postArrivalSupport === "Yes",
      };

      // Save to IndexedDB (merge into latest record)
      const institutions = await getAllInstitutionsFromDB();
      const latest = institutions && institutions.length > 0
        ? institutions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
        : null;

      if (latest) {
        await updateInstitutionInDB({
          ...(latest as any),
          ...normalized,
          id: latest.id,
          updatedAt: Date.now(),
        });
      } else {
        await addInstitutionToDB({ ...(normalized as any) } as any);
      }

      // Export and upload to backend like other flows
      const response = await exportAndUploadInstitutionAndCourses();
      if (response.success) {
        onSuccess?.();
        router.push("/payment");
      } else {
        alert(response?.message || "Failed to save Study Abroad details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <_Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <_DialogTrigger asChild>{trigger}</_DialogTrigger>}

      <_DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide top-[65%]"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <_Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
          <_CardContent className="space-y-6">

            {/* ✅ 2. Conditionally render the correct imported form component */}

            {isKindergarten && (
              <KindergartenForm
                formData={formData}
                formErrors={formErrors}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                handleOperationalDayChange={handleOperationalDayChange}
                operationalDaysOptions={operationalDaysOptions}
                handleSubmit={handleSubmit as unknown as (e: React.FormEvent<Element>) => void}
                isLoading={isLoading}
                onPrevious={onPrevious || (() => {})}
              />
            )}

            {isSchool && (
              <SchoolForm
                schoolFormData={schoolFormData}
                schoolFormErrors={schoolFormErrors}
                handleSchoolFieldChange={handleSchoolFieldChange}
                handleSchoolRadioChangeWithValidation={handleSchoolRadioChangeWithValidation}
                handleSchoolOperationalDayToggle={handleSchoolOperationalDayToggle}
                operationalDaysOptions={operationalDaysOptions}
                handleSchoolSubmit={handleSchoolSubmit}
                isLoading={isLoading}
                onPrevious={onPrevious || (() => {})}
              />
            )}
            
            {isCoaching && (
              <CoachingForm
                coachingFormData={coachingFormData}
                coachingFormErrors={coachingFormErrors}
                handleCoachingFieldChange={handleCoachingFieldChange}
                handleCoachingSubmit={handleCoachingSubmit}
                isLoading={isLoading}
                onPrevious={onPrevious || (() => {})}
              />
            )}

            {isStudyAbroad && (
              <StudyAbroadForm
                formData={studyAbroadFormData}
                formErrors={studyAbroadFormErrors}
                onRadioChange={handleStudyAbroadRadioChange}
                onSubmit={handleStudyAbroadSubmit}
                isLoading={isLoading}
                onPrevious={onPrevious}
              />
            )}

            {isIntermediate && (
               <CollegeForm
                collegeFormData={collegeFormData}
                collegeFormErrors={collegeFormErrors}
                handleCollegeFieldChange={handleCollegeFieldChange}
                handleCollegeRadioChangeWithValidation={handleCollegeRadioChangeWithValidation}
                handleCollegeOperationalDayToggle={handleCollegeOperationalDayToggle}
                operationalDaysOptions={operationalDaysOptions}
                handleCollegeSubmit={handleCollegeSubmit}
                isLoading={isLoading}
                onPrevious={onPrevious || (() => {})}
              />
            )}

            {isUndergraduate && (
              <UndergraduateForm
                undergraduateFormData={undergraduateFormData}
                undergraduateFormErrors={undergraduateFormErrors}
                handleUndergraduateChange={handleUndergraduateChange}
                handleUndergraduateRadioChange={handleUndergraduateRadioChange}
                handleUndergraduateSubmit={handleUndergraduateSubmit}
                isLoading={isLoading}
                onPrevious={onPrevious || (() => {})}
              />
            )}
            
          </_CardContent>
        </_Card>
      </_DialogContent>
    </_Dialog>
  );
}
