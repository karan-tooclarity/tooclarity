"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import React from "react";
import { programsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import InputField from "@/components/ui/InputField";
import { Upload, Plus, MoreVertical } from "lucide-react";
import {
  addBranchesToDB,
  getAllBranchesFromDB,
  updateBranchInDB,
  addCoursesGroupToDB,
  getCoursesGroupsByBranchName,
  updateCoursesGroupInDB,
  CourseRecord,
} from "@/lib/localDb";

// ✅ New imports for split forms
import CoachingCourseForm from "./L2DialogBoxParts/Course/CoachingCourseForm";
import StudyHallForm from "./L2DialogBoxParts/Course/StudyHallForm";
import TuitionCenterForm from "./L2DialogBoxParts/Course/TuitionCenterForm";
import UnderPostGraduateForm from "./L2DialogBoxParts/Course/UnderPostGraduateForm";
import BasicCourseForm from "./L2DialogBoxParts/Course/BasicCourseForm";
import FallbackCourseForm from "./L2DialogBoxParts/Course/FallbackCourseForm";
import StudyAbroadForm from "./L2DialogBoxParts/Course/StudyAbroadForm";
import BranchForm from "./L2DialogBoxParts/Branch/BranchForm";
// import { error } from "console";
import {
  exportAndUploadInstitutionAndCourses,
  // exportInstitutionAndCoursesToFile,
} from "@/lib/utility";
import { L2Schemas } from "@/lib/validations/L2Schema";
// import { createdBranchRule } from "@/lib/validations/ValidationRules";
import { uploadToS3 } from "@/lib/awsUpload";
import AppSelect from "@/components/ui/AppSelect";
import { toast } from "react-toastify";

interface L2DialogBoxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onPrevious?: () => void;
  initialSection?: "course" | "branch";
  // New: render inline (non-_Dialog) for subscription page usage
  renderMode?: "_Dialog" | "inline";
  // New: subscription mode for Program creation flow on Subscription page
  mode?: "default" | "subscriptionProgram" | "settingsEdit";
  institutionId?: string;
  // New: for editing existing programs in settings
  editMode?: boolean;
  existingCourseData?: Partial<Course> & { _id?: string; branch?: string };
  onEditSuccess?: () => void;
  // Test-only overrides to avoid localStorage dependency
}
export interface Course {
  id: number;
  courseName: string;
  aboutCourse: string;
  courseDuration: string;
  startDate: string;
  endDate: string;
  mode: string;
  priceOfCourse: string;
  location: string;
  image: File | null;
  imageUrl: string;
  imagePreviewUrl: string;
  brochureUrl: string;
  brochurePreviewUrl: string;
  brochure: File | null;
  graduationType: string;
  streamType: string;
  selectBranch: string;
  aboutBranch: string;
  educationType: string;
  classSize: string;
  categoriesType: string;
  domainType: string;
  subDomainType: string;
  courseHighlights: string;
  seatingOption: string;
  openingTime: string;
  closingTime: string;
  hallName?: string;
  operationalDays: string[];
  totalSeats: string;
  availableSeats: string;
  pricePerSeat: string;
  hasWifi: string;
  hasChargingPoints: string;
  hasAC: string;
  hasPersonalLocker: string;
  eligibilityCriteria: string;
  tuitionType: string;
  instructorProfile: string;
  subject: string;
  createdBranch: string;
  consultancyName: string;
  studentAdmissions: string;
  countriesOffered: string;
  academicOfferings: string;
  businessProof: File | null;
  businessProofUrl: string;
  businessProofPreviewUrl: string;
  panAadhaar: File | null;
  panAadhaarUrl: string;
  panAadhaarPreviewUrl: string;
  classSizeRatio?: string;
}

// Branch shape used locally in this component; dbId tracks IndexedDB id
interface Branch {
  id: number; // local UI id
  branchName: string;
  branchAddress: string;
  contactInfo: string;
  locationUrl: string;
  dbId?: number; // IndexedDB generated id when persisted
}

export default function L2DialogBox({
  trigger,
  open,
  onOpenChange,
  onSuccess,
  onPrevious,

  initialSection: initialSectionProp,
  renderMode = "_Dialog",
  mode = "default",
  institutionId,
  editMode = false,
  existingCourseData,
  onEditSuccess,
}: L2DialogBoxProps) {
  const router = useRouter();
  const [isCoursrOrBranch, setIsCourseOrBranch] = useState<string | null>(null);
  const [institutionType, setInstitutionType] = useState<string | null>(null);

  useEffect(() => {
    setIsCourseOrBranch(localStorage.getItem("selected"));
    setInstitutionType(localStorage.getItem("institutionType"));
  }, []);
  const isUnderPostGraduate =
    institutionType === "Under Graduation/Post Graduation";
  const isCoachingCenter = institutionType === "Coaching centers";
  const isStudyHall = institutionType === "Study Halls";
  const isTutionCenter = institutionType === "Tution Center's";
  const isKindergarten = institutionType === "Kindergarten/childcare center";
  const isSchool = institutionType === "School's";
  const isIntermediateCollege = institutionType === "Intermediate college(K12)";
  const isStudyAbroad = institutionType === "Study Abroad";

  // Basic course form (only common fields) for these institution types
  const isBasicCourseForm = isKindergarten || isSchool || isIntermediateCollege;

  // Institution types that should skip L3DialogBox and go directly to dashboard
  const shouldSkipL3 = isStudyHall || isTutionCenter;

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(1);
  const [showCourseAfterBranch, setShowCourseAfterBranch] = useState(false);
  const [branchOptions, setBranchOptions] = useState<string[]>([]);
  const [remoteBranches, setRemoteBranches] = useState<
    Array<{ _id: string; branchName: string }>
  >([]);
  const [selectedBranchIdForProgram, setSelectedBranchIdForProgram] =
    useState<string>("");
  const [programBranchError, setProgramBranchError] = useState<string>("");

  const uniqueRemoteBranches = React.useMemo(() => {
    const seenNames = new Set<string>();
    const seenIds = new Set<string>();
    const result: Array<{ _id: string; branchName: string }> = [];
    for (const b of remoteBranches) {
      const id = String(b?._id || "");
      const name = (b?.branchName || "Branch").trim();
      const keyName = name.toLowerCase();
      if (!id || seenIds.has(id) || seenNames.has(keyName)) continue;
      seenIds.add(id);
      seenNames.add(keyName);
      result.push({ _id: id, branchName: name });
    }
    return result.sort((a, b) => a.branchName.localeCompare(b.branchName));
  }, [remoteBranches]);

  const [branchErrors, setBranchErrors] = useState<
    Record<number, Record<string, string>>
  >({});

  // ✅ Load whatever data exists in IndexedDB (branches + courses)
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // --- Load saved branches ---
  //       const savedBranches = await getAllBranchesFromDB();
  //       if (savedBranches?.length) {
  //         setBranches(
  //           savedBranches.map((b, i) => ({
  //             id: i + 1,
  //             branchName: b.branchName || "",
  //             branchAddress: b.branchAddress || "",
  //             contactInfo: b.contactInfo || "",
  //             locationUrl: b.locationUrl || "",
  //             dbId: b.id,
  //           }))
  //         );
  //       }

  //       // --- Load saved course groups ---
  //       const allGroups = await getCoursesGroupsByBranchName();
  //       const loadedCourses: Course[] = [];

  //       allGroups.forEach((group) => {
  //         (group.courses || []).forEach((c: CourseRecord) => {
  //           const loadedCourse: Course = {
  //             id: loadedCourses.length + 1,
  //             courseName: c.courseName ?? "",
  //             aboutCourse: c.aboutCourse ?? "",
  //             courseDuration: c.courseDuration ?? "",
  //             startDate: c.startDate ?? "",
  //             endDate: c.endDate ?? "",
  //             mode: c.mode ?? "Offline",
  //             priceOfCourse: c.priceOfCourse ?? "",
  //             location: c.location ?? "",
  //             image: null,
  //             imageUrl: c.imageUrl ?? "",
  //             imagePreviewUrl: c.imagePreviewUrl ?? c.imageUrl ?? "",
  //             brochureUrl: c.brochureUrl ?? "",
  //             brochurePreviewUrl: c.brochurePreviewUrl ?? c.brochureUrl ?? "",
  //             brochure: null,
  //             graduationType: c.graduationType ?? "",
  //             streamType: c.streamType ?? "",
  //             selectBranch: c.selectBranch ?? "",
  //             aboutBranch: c.aboutBranch ?? "",
  //             educationType: c.educationType ?? "",
  //             classSize: c.classSize ?? "",
  //             categoriesType: c.categoriesType ?? "",
  //             domainType: c.domainType ?? "",
  //             subDomainType: c.subDomainType ?? "",
  //             courseHighlights: c.courseHighlights ?? "",
  //             seatingOption: c.seatingOption ?? "",
  //             openingTime: c.openingTime ?? "",
  //             closingTime: c.closingTime ?? "",
  //             hallName: c.hallName ?? "",
  //             operationalDays: c.operationalDays ?? [],
  //             totalSeats: c.totalSeats ?? "",
  //             availableSeats: c.availableSeats ?? "",
  //             pricePerSeat: c.pricePerSeat ?? "",
  //             hasWifi: c.hasWifi ? "Yes" : "No",
  //             hasChargingPoints: c.hasChargingPoints ? "Yes" : "No",
  //             hasAC: c.hasAC ? "Yes" : "No",
  //             hasPersonalLocker: c.hasPersonalLocker ? "Yes" : "No",
  //             eligibilityCriteria: c.eligibilityCriteria ?? "",
  //             tuitionType: c.tuitionType ?? "",
  //             instructorProfile: c.instructorProfile ?? "",
  //             subject: c.subject ?? "",
  //             createdBranch: group.branchName ?? "",
  //           };

  //           loadedCourses.push(loadedCourse);
  //         });
  //       });

  //       if (loadedCourses.length > 0) {
  //         setCourses(loadedCourses);
  //         setSelectedCourseId(loadedCourses[0].id);
  //       }

  //       console.log(
  //         `📦 IndexedDB loaded → ${savedBranches.length} branches, ${loadedCourses.length} courses`
  //       );
  //     } catch (err) {
  //       console.error("❌ Failed to load IndexedDB data:", err);
  //     }
  //   })();
  // }, []);


  useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    try {
      // --- Load saved branches ---
      const savedBranches = await getAllBranchesFromDB();
      if (isMounted && savedBranches?.length) {
        setBranches(
          savedBranches.map((b, i) => ({
            id: i + 1,
            branchName: b.branchName || "",
            branchAddress: b.branchAddress || "",
            contactInfo: b.contactInfo || "",
            locationUrl: b.locationUrl || "",
            dbId: b.id,
          }))
        );
      }

      // --- Load saved course groups ---
      const allGroups = await getCoursesGroupsByBranchName();
      const loadedCourses: Course[] = [];

      allGroups.forEach((group) => {
        (group.courses || []).forEach((c: CourseRecord) => {
          const loadedCourse: Course = {
            id: loadedCourses.length + 1,
            courseName: c.courseName ?? "",
            aboutCourse: c.aboutCourse ?? "",
            courseDuration: c.courseDuration ?? "",
            startDate: c.startDate ?? "",
            endDate: c.endDate ?? "",
            mode: c.mode ?? "Offline",
            priceOfCourse: c.priceOfCourse ?? "",
            location: c.location ?? "",
            image: null,
            imageUrl: c.imageUrl ?? "",
            imagePreviewUrl: c.imagePreviewUrl ?? c.imageUrl ?? "",
            brochureUrl: c.brochureUrl ?? "",
            brochurePreviewUrl:
              c.brochurePreviewUrl ?? c.brochureUrl ?? "",
            brochure: null,
            graduationType: c.graduationType ?? "",
            streamType: c.streamType ?? "",
            selectBranch: c.selectBranch ?? "",
            aboutBranch: c.aboutBranch ?? "",
            educationType: c.educationType ?? "",
            classSize: c.classSize ?? "",
            categoriesType: c.categoriesType ?? "",
            domainType: c.domainType ?? "",
            subDomainType: c.subDomainType ?? "",
            courseHighlights: c.courseHighlights ?? "",
            seatingOption: c.seatingOption ?? "",
            openingTime: c.openingTime ?? "",
            closingTime: c.closingTime ?? "",
            hallName: c.hallName ?? "",
            operationalDays: c.operationalDays ?? [],
            totalSeats: c.totalSeats ?? "",
            availableSeats: c.availableSeats ?? "",
            pricePerSeat: c.pricePerSeat ?? "",
            hasWifi: c.hasWifi ? "Yes" : "No",
            hasChargingPoints: c.hasChargingPoints ? "Yes" : "No",
            hasAC: c.hasAC ? "Yes" : "No",
            hasPersonalLocker: c.hasPersonalLocker ? "Yes" : "No",
            eligibilityCriteria: c.eligibilityCriteria ?? "",
            tuitionType: c.tuitionType ?? "",
            instructorProfile: c.instructorProfile ?? "",
            subject: c.subject ?? "",
            createdBranch: group.branchName ?? "",
            consultancyName: "",
            studentAdmissions: "",
            countriesOffered: "",
            academicOfferings: "",
            businessProof: null,
            businessProofUrl: "",
            businessProofPreviewUrl: "",
            panAadhaar: null,
            panAadhaarUrl: "",
            panAadhaarPreviewUrl: "",
          };

          loadedCourses.push(loadedCourse);
        });
      });

      if (isMounted && loadedCourses.length > 0) {
        setCourses(loadedCourses);
        setSelectedCourseId(loadedCourses[0].id);
      }

      console.log(
        `📦 IndexedDB loaded → ${savedBranches.length} branches, ${loadedCourses.length} courses`
      );
    } catch (err) {
      console.error("❌ Failed to load IndexedDB data:", err);
    }
  };

  // 🔹 Initial data load
  loadData();

  // 🔁 Re-run when IndexedDB updates
  const handleDBUpdate = (e: CustomEvent) => {
    console.log(`♻️ IndexedDB updated in store: ${e.detail.storeName}`);
    loadData();
  };

  window.addEventListener("indexeddb-updated", handleDBUpdate as EventListener);

  return () => {
    isMounted = false;
    window.removeEventListener("indexeddb-updated", handleDBUpdate as EventListener);
  };
}, []);


  // Handle controlled open state
  const DialogOpen =
    renderMode === "inline" ? true : open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;

  const isSubscriptionProgram =
    mode === "subscriptionProgram" || mode === "settingsEdit";

  // Load institution type from localStorage when _Dialog opens
  useEffect(() => {
    if (DialogOpen) {
      setIsCourseOrBranch(localStorage.getItem("selected"));
      setInstitutionType(localStorage.getItem("institutionType"));
    }
  }, [DialogOpen, institutionId, isSubscriptionProgram]);

  // Load remote branches for subscription programs
  useEffect(() => {
    if (!DialogOpen || !isSubscriptionProgram) return;

    (async () => {
      try {
        const res = await programsAPI.listBranchesForInstitutionAdmin(
          String(institutionId || "")
        );
        const branches =
          (
            res as {
              data?: { branches?: Array<{ _id: string; branchName?: string }> };
            }
          )?.data?.branches || [];
        setRemoteBranches(
          branches.map((b) => ({
            _id: String(b._id),
            branchName: b.branchName || "Branch",
          }))
        );
      } catch (e) {
        console.log("Error loading branches:", e);
      }
    })();
  }, [DialogOpen, institutionId, isSubscriptionProgram]);

  // Auto-select branch for edit mode
  useEffect(() => {
    if (editMode && existingCourseData && existingCourseData.branch) {
      setSelectedBranchIdForProgram(String(existingCourseData.branch));
    }
  }, [editMode, existingCourseData]);

  const [courses, setCourses] = useState(() => {
    if (editMode && existingCourseData) {
      // Convert existing course data to the expected format
      return [
        {
          id: existingCourseData.id || 1,
          courseName: existingCourseData.courseName || "",
          aboutCourse: existingCourseData.aboutCourse || "",
          courseDuration: existingCourseData.courseDuration || "",
          startDate: existingCourseData.startDate || "",
          endDate: existingCourseData.endDate || "",
          mode: existingCourseData.mode || "Offline",
          priceOfCourse: existingCourseData.priceOfCourse || "",
          eligibilityCriteria: existingCourseData.eligibilityCriteria || "",
          location: existingCourseData.location || "",
          image: null as File | null,
          imageUrl: existingCourseData.imageUrl || "",
          imagePreviewUrl: "",
          brochureUrl: existingCourseData.brochureUrl || "",
          brochure: null as File | null,
          brochurePreviewUrl: "",
          graduationType: existingCourseData.graduationType || "",
          streamType: existingCourseData.streamType || "",
          selectBranch: existingCourseData.selectBranch || "",
          aboutBranch: existingCourseData.aboutBranch || "",
          educationType: existingCourseData.educationType || "Full time",
          classSize: existingCourseData.classSize || "",
          categoriesType: existingCourseData.categoriesType || "",
          domainType: existingCourseData.domainType || "",
          subDomainType: existingCourseData.subDomainType || "",
          courseHighlights: existingCourseData.courseHighlights || "",
          seatingOption: existingCourseData.seatingOption || "",
          openingTime: existingCourseData.openingTime || "",
          closingTime: existingCourseData.closingTime || "",
          operationalDays: existingCourseData.operationalDays || [],
          totalSeats: existingCourseData.totalSeats || "",
          availableSeats: existingCourseData.availableSeats || "",
          pricePerSeat: existingCourseData.pricePerSeat || "",
          hasWifi: existingCourseData.hasWifi || "",
          hasChargingPoints: existingCourseData.hasChargingPoints || "",
          hasAC: existingCourseData.hasAC || "",
          hasPersonalLocker: existingCourseData.hasPersonalLocker || "",
          tuitionType: existingCourseData.tuitionType || "",
          instructorProfile: existingCourseData.instructorProfile || "",
          subject: existingCourseData.subject || "",
          createdBranch: existingCourseData.createdBranch || "",
          consultancyName: existingCourseData.consultancyName || "",
          studentAdmissions: existingCourseData.studentAdmissions || "",
          countriesOffered: existingCourseData.countriesOffered || "",
          academicOfferings: existingCourseData.academicOfferings || "",
          businessProof: null as File | null,
          businessProofUrl: existingCourseData.businessProofUrl || "",
          businessProofPreviewUrl: "",
          panAadhaar: null as File | null,
          panAadhaarUrl: existingCourseData.panAadhaarUrl || "",
          panAadhaarPreviewUrl: "",
        },
      ];
    }

    // Default initialization for new courses
    return [
      {
        id: 1,
        courseName: "",
        aboutCourse: "",
        courseDuration: "",
        startDate: "",
        endDate: "",
        mode: "Offline",
        priceOfCourse: "",
        eligibilityCriteria: "",
        location: "",
        image: null as File | null,
        imageUrl: "",
        imagePreviewUrl: "",
        brochureUrl: "",
        brochure: null as File | null,
        brochurePreviewUrl: "",
        graduationType: "",
        streamType: "",
        selectBranch: "",
        aboutBranch: "",
        educationType: "Full time",
        classSize: "",
        categoriesType: "",
        domainType: "",
        subDomainType: "",
        courseHighlights: "",
        seatingOption: "",
        openingTime: "",
        closingTime: "",
        operationalDays: [] as string[],
        totalSeats: "",
        availableSeats: "",
        pricePerSeat: "",
        hasWifi: "",
        hasChargingPoints: "",
        hasAC: "",
        hasPersonalLocker: "",
        tuitionType: "",
        instructorProfile: "",
        subject: "",
        createdBranch: "",
        consultancyName: "",
        studentAdmissions: "",
        countriesOffered: "",
        academicOfferings: "",
        businessProof: null as File | null,
        businessProofUrl: "",
        businessProofPreviewUrl: "",
        panAadhaar: null as File | null,
        panAadhaarUrl: "",
        panAadhaarPreviewUrl: "",
      },
    ];
  });

  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Branch state
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: 1,
      branchName: "",
      branchAddress: "",
      contactInfo: "",
      locationUrl: "",
      dbId: undefined,
    },
  ]);

  const initialSection: "course" | "branch" =
    isCoursrOrBranch === "course" || isCoursrOrBranch === "branch"
      ? (isCoursrOrBranch as "course" | "branch")
      : initialSectionProp || "course";

  type UploadField = {
    label: string;
    type: "image" | "brochure";
    accept: string;
  };

  const uploadFields: UploadField[] = [
    { label: "Add Image", type: "image", accept: "image/*" },
    { label: "Add Brochure", type: "brochure", accept: "application/pdf" },
  ];

  const handleCourseChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const courseToUpdate = courses.find((c) => c.id === selectedCourseId);
    if (!courseToUpdate) return;

    const updatedCourse = { ...courseToUpdate, [name]: value };

    setCourses(
      courses.map((course) =>
        course.id === selectedCourseId ? updatedCourse : course
      )
    );

    const schema = L2Schemas[getSchemaKey()];
    if (!schema) return;

    const { error } = schema.validate(updatedCourse, {
      abortEarly: false,
      allowUnknown: true,
    });

    const fieldError = error?.details.find((detail) => detail.path[0] === name);

    setCourseErrorsById((prevErrors) => {
      const updatedErrorsForCourse = {
        ...(prevErrors[selectedCourseId] || {}),
      };

      if (fieldError) {
        updatedErrorsForCourse[name] = fieldError.message;
      } else {
        delete updatedErrorsForCourse[name];
      }

      return {
        ...prevErrors,
        [selectedCourseId]: updatedErrorsForCourse,
      };
    });
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "brochure" | "businessProof" | "panAadhaar"
  ) => {
    const fileInput = e.target;
    const files = fileInput.files;
    if (!files || !files[0]) return;

    const selectedFile = files[0];
    const courseId = selectedCourseId;

    const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const allowedPdfTypes = ["application/pdf"];

    let errorMessage = "";

    if (
      (type === "image" || type === "businessProof") &&
      !allowedImageTypes.includes(selectedFile.type)
    ) {
      errorMessage = "Only PNG, JPG, or JPEG images are allowed.";
    } else if (
      (type === "brochure" || type === "panAadhaar") &&
      !allowedPdfTypes.includes(selectedFile.type)
    ) {
      errorMessage = "Only PDF files are allowed.";
    }

    const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      errorMessage = "File size must be 4 MB or less.";
    }

    if (errorMessage) {
      setCourseErrorsById((prev) => ({
        ...prev,
        [courseId]: {
          ...(prev[courseId] || {}),
          [`${type}Url`]: errorMessage,
        },
      }));
      return;
    }

    setCourseErrorsById((prev) => {
      const updated = { ...(prev[courseId] || {}) };
      delete updated[`${type}Url`];
      return { ...prev, [courseId]: updated };
    });

    const previewUrl = URL.createObjectURL(selectedFile);

    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              [`${type}`]: selectedFile,
              [`${type}PreviewUrl`]: previewUrl,
            }
          : course
      )
    );

    fileInput.value = "";
  };

  const handleOperationalDayChange = (day: string) => {
    const courseToUpdate = courses.find((c) => c.id === selectedCourseId);
    if (!courseToUpdate) return;

    const newOperationalDays = courseToUpdate.operationalDays.includes(day)
      ? courseToUpdate.operationalDays.filter((d: string) => d !== day)
      : [...courseToUpdate.operationalDays, day];

    setCourses(
      courses.map((course) =>
        course.id === selectedCourseId
          ? { ...course, operationalDays: newOperationalDays }
          : course
      )
    );

    const schema = L2Schemas[getSchemaKey()];
    let validationError = "";

    if (schema && schema.extract("operationalDays")) {
      const { error } = schema
        .extract("operationalDays")
        .validate(newOperationalDays);
      if (error) {
        validationError = error.details[0].message;
      }
    }

    setCourseErrorsById((prevErrors) => ({
      ...prevErrors,
      [selectedCourseId]: {
        ...(prevErrors[selectedCourseId] || {}),
        operationalDays: validationError,
      },
    }));
  };

  const addNewCourse = () => {
    const newId = Math.max(...courses.map((c) => c.id)) + 1;
    const newCourse = {
      id: newId,
      courseName: "",
      aboutCourse: "",
      courseDuration: "",
      startDate: "",
      endDate: "",
      mode: "Offline",
      priceOfCourse: "",
      location: "",
      image: null as File | null,
      imagePreviewUrl: "",
      imageUrl: "",
      brochureUrl: "",
      brochurePreviewUrl: "",
      brochure: null as File | null,
      graduationType: "",
      streamType: "",
      selectBranch: "",
      aboutBranch: "",
      educationType: "Full time",
      classSize: "",
      categoriesType: "",
      domainType: "",
      eligibilityCriteria: "",
      subDomainType: "",
      courseHighlights: "",
      seatingOption: "",
      openingTime: "",
      closingTime: "",
      operationalDays: [] as string[],
      totalSeats: "",
      availableSeats: "",
      pricePerSeat: "",
      hasWifi: "",
      hasChargingPoints: "",
      hasAC: "",
      hasPersonalLocker: "",
      tuitionType: "",
      instructorProfile: "",
      subject: "",
      createdBranch: "",
      consultancyName: "",
      studentAdmissions: "",
      countriesOffered: "",
      academicOfferings: "",
      businessProof: null as File | null,
      businessProofUrl: "",
      businessProofPreviewUrl: "",
      panAadhaar: null as File | null,
      panAadhaarUrl: "",
      panAadhaarPreviewUrl: "",
    };
    setCourses([...courses, newCourse]);
    setSelectedCourseId(newId);
  };

  const deleteCourse = (courseId: number) => {
    if (courses.length > 1) {
      const updatedCourses = courses.filter((c) => c.id !== courseId);
      setCourses(updatedCourses);
      if (selectedCourseId === courseId) {
        setSelectedCourseId(updatedCourses[0].id);
      }
    }
  };

  const addNewBranch = () => {
    setBranches((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((b) => b.id)) + 1 : 1;
      const newBranch: Branch = {
        id: newId,
        branchName: "",
        branchAddress: "",
        contactInfo: "",
        locationUrl: "",
        dbId: undefined,
      };
      setSelectedBranchId(newId);
      return [...prev, newBranch];
    });
  };

  const deleteBranch = (branchId: number) => {
    setBranches((prev) => {
      if (prev.length <= 1) return prev;
      const updated = prev.filter((b) => b.id !== branchId);
      if (selectedBranchId === branchId) {
        setSelectedBranchId(updated[0].id);
      }
      return updated;
    });
  };

  const [courseErrorsById, setCourseErrorsById] = useState<
    Record<number, Record<string, string>>
  >({});

  const getRequiredFields = () => {
    switch (true) {
      case isBasicCourseForm:
        return [
          "courseName",
          "aboutCourse",
          "courseDuration",
          "priceOfCourse",
          "location",
          "startDate",
          "endDate",
          "image",
          "brochure",
        ];
      case isUnderPostGraduate:
        return [
          "graduationType",
          "streamType",
          "selectBranch",
          "aboutBranch",
          "courseDuration",
          "startDate",
          "endDate",
          "priceOfCourse",
          "classSize",
          "eligibilityCriteria",
          "image",
          "brochure",
        ];
      case isCoachingCenter:
        return [
          "categoriesType",
          "domainType",
          "subDomainType",
          "startDate",
          "endDate",
          "courseName",
          "courseDuration",
          "priceOfCourse",
          "classSize",
          "location",
          "image",
          "brochure",
        ];
      case isTutionCenter:
        return [
          "tuitionType",
          "instructorProfile",
          "subject",
          "openingTime",
          "closingTime",
          "totalSeats",
          "availableSeats",
          "operationalDays",
          "startDate",
          "endDate",
          "pricePerSeat",
          "image",
        ];
      case isStudyHall:
        return [
          "hallName",
          "seatingOption",
          "openingTime",
          "closingTime",
          "operationalDays",
          "startDate",
          "endDate",
          "totalSeats",
          "availableSeats",
          "pricePerSeat",
          "hasPersonalLocker",
          "hasWifi",
          "hasChargingPoints",
          "hasAC",
        ];
      case isStudyAbroad:
        return [
          "consultancyName",
          "studentAdmissions",
          "countriesOffered",
          "academicOfferings",
        ];
      default:
        return ["courseName", "courseDuration", "priceOfCourse", "location"];
    }
  };

  const validateCourses = () => {
    const requiredFields = getRequiredFields();
    // ✅ Helper: Check if a field is actually valid
    const hasValidField = (course: Course, field: string) => {
      const value = course[field as keyof Course];

      // 1️⃣ Handle file-type fields (image/brochure)
      if (field === "image") {
        return value instanceof File || !!course.imageUrl;
      }
      if (field === "brochure") {
        return value instanceof File || !!course.brochureUrl;
      }

      // 2️⃣ Handle normal string/number/array fields
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object" && value !== null)
        return Object.keys(value).length > 0;
      if (typeof value === "string") return value.trim() !== "";

      return !!value;
    };

    // ✅ Main validation loop
    for (const course of courses) {
      for (const field of requiredFields) {
        if (!hasValidField(course, field)) {
          return `Please fill in the ${field} field for course: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }

      // 🧩 Type-specific validations
      if (isUnderPostGraduate) {
        if (
          !course.graduationType ||
          !course.streamType ||
          !course.selectBranch
        ) {
          return `Please fill in all graduation details for course: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }

      if (isCoachingCenter) {
        if (!course.categoriesType || !course.domainType) {
          return `Please fill in all coaching details for course: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }

      if (isStudyHall) {
        if (
          !course.openingTime ||
          !course.closingTime ||
          !course.totalSeats ||
          !course.availableSeats
        ) {
          return `Please fill in all study hall details for: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }

      if (isTutionCenter) {
        if (
          !course.tuitionType ||
          !course.instructorProfile ||
          !course.subject ||
          !course.openingTime ||
          !course.closingTime ||
          !course.totalSeats ||
          !course.availableSeats
        ) {
          return `Please fill in all tuition center details for: ${
            course.courseName || "Unnamed course"
          }`;
        }
      }
    }

    return null; // ✅ No validation errors
  };

  // Inside L2DialogBox.tsx

  const getSchemaKey = (): keyof typeof L2Schemas => {
    if (isStudyAbroad) {
      return "studyAbroad";
    }
    if (isCoachingCenter) {
      return "coaching";
    }
    if (isStudyHall) {
      return "studyHall";
    }
    if (isTutionCenter) {
      return "tuition";
    }
    if (isUnderPostGraduate) {
      return "ugpg";
    }
    return "basic";
  };

  const handleCourseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const validationMessage = validateCourses();
    if (validationMessage) {
      toast.error(validationMessage);
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 Starting course submission...");

      const imageUploadCache = new Map<string, string>();
      const brochureUploadCache = new Map<string, string>();

      const uploadedCourses = await Promise.all(
        courses.map(async (course) => {
          const updated = { ...course };

          // --- 🖼️ Image Upload ---

          if (course.image instanceof File) {
            const isNewLocalFile =
              !course.imageUrl || course.imageUrl.startsWith("blob:");
            if (isNewLocalFile) {
              const imageKey = `${course.image.name}|${course.image.size}|${course.image.lastModified}`;

              if (imageUploadCache.has(imageKey)) {
                // ✅ Reuse the already uploaded file URL
                updated.imageUrl = imageUploadCache.get(imageKey)!;
                updated.imagePreviewUrl = URL.createObjectURL(course.image);
                console.log(
                  `♻️ Reused uploaded image for: ${course.courseName}`
                );
              } else {
                console.log(`🪣 Uploading new image for: ${course.courseName}`);
                try {
                  const uploadImage = await uploadToS3(course.image);
                  if (uploadImage.success && uploadImage.fileUrl) {
                    updated.imageUrl = uploadImage.fileUrl;
                    updated.imagePreviewUrl = URL.createObjectURL(course.image);
                    imageUploadCache.set(imageKey, uploadImage.fileUrl); // ✅ Cache URL
                    console.log(`✅ Image uploaded for: ${course.courseName}`);
                  } else {
                    throw new Error(
                      uploadImage.error || "Unknown upload error"
                    );
                  }
                } catch (err) {
                  console.error(
                    `❌ Failed to upload image for ${course.courseName}:`,
                    err
                  );
                  setIsLoading(false);
                }
              }
            } else {
              console.log(
                `⚡ Skipping image upload (already uploaded): ${course.courseName}`
              );
            }
          }

          // --- 📘 Brochure Upload ---
          if (course.brochure instanceof File) {
            const isNewLocalFile =
              !course.brochureUrl || course.brochureUrl.startsWith("blob:");
            if (isNewLocalFile) {
              const brochureKey = `${course.brochure.name}|${course.brochure.size}|${course.brochure.lastModified}`;

              if (brochureUploadCache.has(brochureKey)) {
                // ✅ Reuse uploaded brochure
                updated.brochureUrl = brochureUploadCache.get(brochureKey)!;
                updated.brochurePreviewUrl = URL.createObjectURL(
                  course.brochure
                );
                console.log(
                  `♻️ Reused uploaded brochure for: ${course.courseName}`
                );
              } else {
                console.log(
                  `🪣 Uploading new brochure for: ${course.courseName}`
                );
                try {
                  const uploadBrochure = await uploadToS3(course.brochure);
                  if (uploadBrochure.success && uploadBrochure.fileUrl) {
                    updated.brochureUrl = uploadBrochure.fileUrl;
                    updated.brochurePreviewUrl = URL.createObjectURL(
                      course.brochure
                    );
                    brochureUploadCache.set(
                      brochureKey,
                      uploadBrochure.fileUrl
                    ); // ✅ Cache URL
                    console.log(
                      `✅ Brochure uploaded for: ${course.courseName}`
                    );
                  } else {
                    throw new Error(
                      uploadBrochure.error || "Unknown upload error"
                    );
                  }
                } catch (err) {
                  console.error(
                    `❌ Failed to upload brochure for ${course.courseName}:`,
                    err
                  );
                  setIsLoading(false);
                }
              }
            } else {
              console.log(
                `⚡ Skipping brochure upload (already uploaded): ${course.courseName}`
              );
            }
          }

          return updated;
        })
      );

      setCourses(uploadedCourses);
      console.log("🪣 All uploads completed successfully.");

      if (showCourseAfterBranch) {
        const initialErrors: Record<number, Record<string, string>> = {};
        let hasMissingBranch = false;
        for (const course of uploadedCourses) {
          if (!course.createdBranch) {
            hasMissingBranch = true;
            initialErrors[course.id] = {
              createdBranch: "Please select a branch for this course.",
            };
          }
        }
        if (hasMissingBranch) {
          setCourseErrorsById(initialErrors);
          setIsLoading(false);
          return;
        }
      }

      const allCourseErrors: Record<number, Record<string, string>> = {};
      let hasErrors = false;
      for (const course of uploadedCourses) {
        const courseErrors: Record<string, string> = {};
        if (!course.startDate) {
          courseErrors.startDate = "Start date is required";
          hasErrors = true;
        }
        if (!course.endDate) {
          courseErrors.endDate = "End date is required";
          hasErrors = true;
        } else if (
          course.startDate &&
          new Date(course.endDate) <= new Date(course.startDate)
        ) {
          courseErrors.endDate = "End date must be after start date";
          hasErrors = true;
        }
        if (Object.keys(courseErrors).length > 0) {
          allCourseErrors[course.id] = courseErrors;
        }
      }

      let schema = L2Schemas[getSchemaKey()];
      if (!showCourseAfterBranch) {
        schema = schema.fork("createdBranch", (field) =>
          field.optional().allow("")
        );
      }

      for (const course of uploadedCourses) {
        const { error } = schema.validate(course, {
          abortEarly: false,
          allowUnknown: true,
        });

        if (error) {
          hasErrors = true;
          const fieldErrors = error.details.reduce((acc, detail) => {
            const key = detail.path[0] as string;
            acc[key] = detail.message;
            return acc;
          }, {} as Record<string, string>);
          const existingErrors = allCourseErrors[course.id] || {};
          allCourseErrors[course.id] = { ...existingErrors, ...fieldErrors };
        }
      }

      setCourseErrorsById(allCourseErrors);

      if (hasErrors) {
        setIsLoading(false);
        return;
      }

      if (isSubscriptionProgram) {
        if (!institutionId) {
          throw new Error(
            "institutionId required for subscription program mode"
          );
        }
        if (uniqueRemoteBranches.length > 0 && !selectedBranchIdForProgram) {
          setProgramBranchError("Please select a branch");
          setIsLoading(false);
          return;
        }
        type ProgramPayload = {
          institution: string;
          branch: string | null;
          type: "PROGRAM";
          mode?: string;
          classSize?: string;
          location?: string;
          courseName: string;
          aboutCourse?: string;
          courseDuration?: string;
          startDate?: string;
          endDate?: string;
          priceOfCourse?: number;
          graduationType?: string;
          streamType?: string;
          selectBranch?: string;
        };

        const toCreate: ProgramPayload[] = courses
          .map((c) => {
            const programName = (c.courseName || "").trim();
            return {
              institution: String(institutionId),
              branch: selectedBranchIdForProgram || null,
              mode: c.mode || "Offline",
              classSize: c.classSize || "",
              location: c.location || "",
              type: "PROGRAM" as const,
              courseName: programName,
              aboutCourse: c.aboutCourse || "",
              courseDuration: c.courseDuration || "",
              startDate: c.startDate || undefined,
              endDate: c.endDate || undefined,
              priceOfCourse: c.priceOfCourse
                ? Number(c.priceOfCourse)
                : undefined,
              graduationType: c.graduationType || undefined,
              streamType: c.streamType || undefined,
              selectBranch: c.selectBranch || undefined,
            };
          })
          .filter((p) => p.courseName && p.courseName.length > 0);

        for (const payload of toCreate) {
          if (editMode && existingCourseData) {
            await programsAPI.update(
              String(existingCourseData._id || ""),
              payload
            );
          } else {
            await programsAPI.create(payload);
          }
        }

        if (editMode) {
          onEditSuccess?.();
        } else {
          onSuccess?.();
        }
        setIsLoading(false);
        return;
      }

      const allBranches = await getAllBranchesFromDB();
      const branchMap = new Map(
        allBranches.map((b) => [
          b.branchName.trim().toLowerCase(),
          { ...b, courses: [] as import("@/lib/localDb").CourseRecord[] },
        ])
      );

      const sanitizeCourse = (
        course: Record<string, unknown>
      ): import("@/lib/localDb").CourseRecord =>
        Object.fromEntries(
          Object.entries(course).filter(
            ([, value]) =>
              value !== null &&
              value !== "" &&
              !(Array.isArray(value) && value.length === 0) &&
              value !== false
          )
        ) as import("@/lib/localDb").CourseRecord;

      const unassignedCourses: import("@/lib/localDb").CourseRecord[] = [];
      uploadedCourses.forEach((c) => {
        const key = (c.createdBranch || "").trim().toLowerCase();
        if (!key || !branchMap.has(key)) {
          unassignedCourses.push(sanitizeCourse(c));
        } else {
          branchMap.get(key)!.courses.push(sanitizeCourse(c));
        }
      });

      const sanitizedPayload = [
        ...Array.from(branchMap.values()).filter((b) => b.courses.length > 0),
      ];

      if (unassignedCourses.length > 0) {
      sanitizedPayload.push({
        branchName: "",
        branchAddress: "",
        contactInfo: "",
        locationUrl: "",
        courses: unassignedCourses,
      } satisfies {
        courses: import("@/lib/localDb").CourseRecord[];
        id?: number;
        branchName: string;
        branchAddress: string;
        contactInfo: string;
        locationUrl: string;
        createdAt?: number;
      });
    }


      if (!sanitizedPayload.length) {
        toast.error(
          "No valid courses found. Please select a branch or fill valid details."
        );
        setIsLoading(false);
        return;
      }

      // --- 5️⃣ Save Courses in DB ---
      for (const entry of sanitizedPayload) {
        const safeEntry = JSON.parse(JSON.stringify(entry));

        // 🔍 Correct lookup (undefined means "unassigned" group)
        const existingGroups = await getCoursesGroupsByBranchName(
          safeEntry.branchName?.trim() ? safeEntry.branchName.trim() : undefined
        );

        // 🔍 Find correct existing group (branch or unassigned)
        const existingGroup = safeEntry.branchName?.trim()
          ? existingGroups[0]
          : existingGroups.find((g) => (g.branchName || "").trim() === "");

        if (existingGroup) {
          const existing = existingGroup.courses || [];
          const incoming = safeEntry.courses || [];

          // --- Helper: Compare two courses (ignoring files) ---
          const isCourseChanged = (
            oldCourse: import("@/lib/localDb").CourseRecord,
            newCourse: import("@/lib/localDb").CourseRecord
          ): boolean => {
            const ignored = [
              "image",
              "imageUrl",
              "imagePreviewUrl",
              "brochure",
              "brochureUrl",
              "brochurePreviewUrl",
            ];
            for (const key in newCourse) {
              if (ignored.includes(key)) continue;
              const oldVal = oldCourse[key as keyof typeof oldCourse];
              const newVal = newCourse[key as keyof typeof newCourse];

              // Normalize values for comparison
              const normalizedOld =
                oldVal === null || oldVal === undefined ? "" : oldVal;
              const normalizedNew =
                newVal === null || newVal === undefined ? "" : newVal;

              if (
                Array.isArray(normalizedOld) &&
                Array.isArray(normalizedNew)
              ) {
                if (
                  JSON.stringify(normalizedOld) !==
                  JSON.stringify(normalizedNew)
                )
                  return true;
              } else if (normalizedOld !== normalizedNew) {
                return true;
              }
            }
            return false;
          };

          // ✅ Build merged course list (update changed, keep unchanged)
          const mergedCourses = existing.map((oldCourse) => {
            const updatedCourse = incoming.find(
              (newCourse: import("@/lib/localDb").CourseRecord) =>
                newCourse.id === oldCourse.id
            );
            if (!updatedCourse) return oldCourse; // Not in new list → keep as is

            if (isCourseChanged(oldCourse, updatedCourse)) {
              console.log(
                `🔄 Course updated (ID: ${oldCourse.id}) → ${updatedCourse.courseName}`
              );
              return { ...oldCourse, ...updatedCourse };
            } else {
              console.log(
                `⏩ No changes detected for course ID ${oldCourse.id}`
              );
              return oldCourse;
            }
          });

          // ✅ Add new courses not present in IndexedDB
          const newCourses = incoming.filter(
            (newCourse: import("@/lib/localDb").CourseRecord) =>
              !existing.some((oldCourse) => oldCourse.id === newCourse.id)
          );

          const finalMergedCourses = JSON.parse(
            JSON.stringify([...mergedCourses, ...newCourses])
          );

          const merged = {
            ...existingGroup,
            branchName: safeEntry.branchName || "",
            branchAddress: safeEntry.branchAddress || "",
            contactInfo: safeEntry.contactInfo || "",
            locationUrl: safeEntry.locationUrl || "",
            courses: finalMergedCourses,
          };

          await updateCoursesGroupInDB(merged);
          console.log(
            `✅ Updated branch "${safeEntry.branchName || "(unassigned)"}" — ${
              newCourses.length
            } new, ${incoming.length - newCourses.length} updated, ${
              existing.length
            } kept.`
          );
        } else {
          // 🆕 No existing group → create new
          const safeCourses = JSON.parse(
            JSON.stringify(safeEntry.courses || [])
          );
          await addCoursesGroupToDB({
            branchName: safeEntry.branchName || "",
            branchAddress: safeEntry.branchAddress || "",
            contactInfo: safeEntry.contactInfo || "",
            locationUrl: safeEntry.locationUrl || "",
            courses: safeCourses,
          });
          console.log(
            `🆕 Created new branch "${
              safeEntry.branchName || "(unassigned)"
            }" with ${safeEntry.courses.length} course(s).`
          );
        }
      }

      console.log("💾 All courses saved successfully.");

      setSelectedCourseId(1);

      // --- 6️⃣ Export if required ---
      if (shouldSkipL3) {
        const response = await exportAndUploadInstitutionAndCourses();
        if (response.success) {
          router.push("/payment");
        } else {
          toast.error(response.message);
          setDialogOpen(true);
          localStorage.setItem("signupStep", "2");
        }
      }

      onSuccess?.();
    } catch (error) {
      console.error("❌ Error saving courses:", error);
      toast.error("Failed to save course details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name: string, value: string) => {
    const keyExists = L2Schemas.branch.$_terms.keys?.some(
      (k: Record<string, unknown>) => k.key === name
    );
    if (!keyExists) return "";

    const { error } = L2Schemas.branch.extract(name).validate(value);
    return error ? error.details[0].message : "";
  };

  const handleBranchChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === selectedBranchId ? { ...branch, [name]: value } : branch
      )
    );

    const error = validateField(name, value);
    setBranchErrors((prev) => ({
      ...prev,
      [selectedBranchId]: {
        ...(prev[selectedBranchId] || {}),
        [name]: error,
      },
    }));
  };

  const handleBranchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentBranch = branches.find((b) => b.id === selectedBranchId);
    if (!currentBranch) return;

    const { error } = L2Schemas.branch.validate(currentBranch, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const newErrors: Record<string, string> = {};
      error.details.forEach((err) => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setBranchErrors((prev) => ({
        ...prev,
        [selectedBranchId]: newErrors,
      }));
      return;
    }

    setBranchErrors((prev) => ({ ...prev, [selectedBranchId]: {} }));

    setIsLoading(true);
    try {
      const payload = {
        branchName: currentBranch.branchName,
        branchAddress: currentBranch.branchAddress,
        contactInfo: currentBranch.contactInfo,
        locationUrl: currentBranch.locationUrl,
      };

      if (currentBranch.dbId) {
        await updateBranchInDB({ id: currentBranch.dbId, ...payload });
      } else {
        const [newId] = await addBranchesToDB([payload]);
        setBranches((prev) =>
          prev.map((b) =>
            b.id === selectedBranchId ? { ...b, dbId: newId } : b
          )
        );
      }

      const all = await getAllBranchesFromDB();
      setBranchOptions(all.map((b) => b.branchName).filter(Boolean));
      setShowCourseAfterBranch(true);
    } catch (err) {
      console.error("Error saving branch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <_Card className="w-full sm:p-6 rounded-[24px] bg-white dark:bg-gray-900 border-0 shadow-none">
      <_CardContent className="space-y-6 text-gray-900 dark:text-gray-100">
        {initialSection === "course" ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold dark:text-gray-50">
                {isStudyHall
                  ? "Study Hall"
                  : isTutionCenter
                  ? "Tuition Hall"
                  : isSubscriptionProgram
                  ? "Program Details"
                  : "Course Details"}
              </h3>
              <p className="text-[#697282] dark:text-gray-300 text-sm">
                {isStudyHall
                  ? "Enter the details of the study hall."
                  : isTutionCenter
                  ? "Enter the details of the tuition hall."
                  : isSubscriptionProgram
                  ? "Enter the programs your institution offers."
                  : "Enter the courses your institution offers."}
              </p>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <div key={course.id} className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                        selectedCourseId === course.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>
                        {course.courseName ||
                          (isStudyHall
                            ? `Hall ${course.id}`
                            : isTutionCenter
                            ? `Hall ${course.id}`
                            : isSubscriptionProgram
                            ? `Program ${course.id}`
                            : `Course ${course.id}`)}
                      </span>
                      {courses.length > 1 && (
                        <MoreVertical
                          size={14}
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCourse(course.id);
                          }}
                        />
                      )}
                    </Button>
                  </div>
                ))}
              </div> */}
              <div className="flex items-center gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <div key={course.id} className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                        selectedCourseId === course.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>
                        {course.courseName ||
                          (isStudyHall
                            ? `Hall ${index + 1}`
                            : isTutionCenter
                            ? `Tuition ${index + 1}`
                            : isSubscriptionProgram
                            ? `Program ${index + 1}`
                            : `Course ${index + 1}`)}
                      </span>

                      {courses.length > 1 && (
                        <MoreVertical
                          size={14}
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCourse(course.id);
                          }}
                        />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={addNewCourse}
                className="bg-[#0222D7] hover:bg-[#0222D7]/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                {isStudyHall
                  ? "Add Hall"
                  : isTutionCenter
                  ? "Add Hall"
                  : isSubscriptionProgram
                  ? "Add Program"
                  : "Add Course"}
              </Button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-6">
              {isSubscriptionProgram && uniqueRemoteBranches.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Branch
                  </label>
                  <AppSelect
                    value={selectedBranchIdForProgram}
                    onChange={(val) => {
                      setSelectedBranchIdForProgram(val);
                      setProgramBranchError("");
                    }}
                    options={uniqueRemoteBranches.map((b) => ({
                      label: b.branchName,
                      value: b._id,
                    }))}
                    placeholder="Select Branch"
                    variant="white"
                    size="md"
                    rounded="lg"
                    className="w-full"
                  />
                  {programBranchError && (
                    <p className="text-red-600 text-xs mt-1">
                      {programBranchError}
                    </p>
                  )}
                </div>
              )}

              {isStudyAbroad ? (
                <StudyAbroadForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  handleFileChange={handleFileChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                />
              ) : isCoachingCenter ? (
                <CoachingCourseForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                />
              ) : isStudyHall ? (
                <StudyHallForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  handleOperationalDayChange={handleOperationalDayChange}
                  handleFileChange={handleFileChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                  labelVariant={isSubscriptionProgram ? "program" : "course"}
                />
              ) : isTutionCenter ? (
                <TuitionCenterForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  handleOperationalDayChange={handleOperationalDayChange}
                  handleFileChange={handleFileChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                  labelVariant={isSubscriptionProgram ? "program" : "course"}
                />
              ) : isUnderPostGraduate ? (
                <UnderPostGraduateForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                  labelVariant={isSubscriptionProgram ? "program" : "course"}
                />
              ) : isBasicCourseForm ? (
                <BasicCourseForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                  labelVariant={isSubscriptionProgram ? "program" : "course"}
                />
              ) : (
                <FallbackCourseForm
                  currentCourse={currentCourse}
                  handleCourseChange={handleCourseChange}
                  setCourses={setCourses}
                  courses={courses}
                  selectedCourseId={selectedCourseId}
                  courseErrors={courseErrorsById[currentCourse.id] || {}}
                  labelVariant={isSubscriptionProgram ? "program" : "course"}
                />
              )}
              {!isStudyHall && !isTutionCenter && !isStudyAbroad && (
                <div className="grid md:grid-cols-2 gap-6">
                  {uploadFields.map((f) => (
                    <div
                      key={`${f.type}-${currentCourse.id}`}
                      className="flex flex-col gap-2"
                    >
                      <label className="font-medium text-[16px]">
                        {f.label} <span className="text-red-500">*</span>
                      </label>

                      <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
                        {(() => {
                          const previewUrl = currentCourse[
                            `${f.type}PreviewUrl`
                          ] as string;

                          if (previewUrl) {
                            if (f.type === "image") {
                              return (
                                <Image
                                  src={previewUrl}
                                  width={100}
                                  height={100}
                                  alt={`${f.label} Preview`}
                                  className="w-[100px] h-[100px] object-cover rounded-md"
                                />
                              );
                            } else {
                              return (
                                <div className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
                                  <span className="text-sm text-gray-500 truncate">
                                    {(() => {
                                      if (
                                        currentCourse[f.type] instanceof File
                                      ) {
                                        return (currentCourse[f.type] as File)
                                          .name;
                                      }

                                      const url = currentCourse[`${f.type}Url`];
                                      if (url) {
                                        const rawName = decodeURIComponent(
                                          url.split("/").pop()?.split("?")[0] ||
                                            ""
                                        );
                                        // 🧹 remove timestamp prefix (e.g. "1762336776327-")
                                        const cleanName = rawName.replace(
                                          /^\d+-/,
                                          ""
                                        );
                                        return cleanName;
                                      }

                                      return "No file selected";
                                    })()}
                                  </span>
                                </div>
                              );
                            }
                          }
                          return (
                            <>
                              <Upload
                                size={24}
                                className="text-gray-400 dark:text-gray-300 mb-2"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-300">
                                {f.type === "image"
                                  ? isSubscriptionProgram
                                    ? "Upload Program Image (jpg / jpeg)"
                                    : "Upload Course Image (jpg / jpeg / png)"
                                  : isSubscriptionProgram
                                  ? "Upload Program Brochure (pdf)"
                                  : "Upload Course Brochure (pdf)"}
                              </span>
                            </>
                          );
                        })()}
                        <input
                          type="file"
                          accept={f.accept}
                          className="absolute inset-0 opacity-0 cursor-pointer dark:bg-gray-800"
                          onChange={(e) => handleFileChange(e, f.type)}
                        />
                      </label>
                      {courseErrorsById[currentCourse.id]?.[`${f.type}Url`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {courseErrorsById[currentCourse.id][`${f.type}Url`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-10">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="w-[314px] h-[48px] border border-[#697282] text-[#697282] rounded-[12px] font-semibold text-[18px] leading-[22px] flex items-center justify-center shadow-inner"
                >
                  Previous
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-[314px] h-[48px] rounded-[12px] font-semibold transition-colors 
                    ${
                      isLoading
                        ? "opacity-50 cursor-not-allowed bg-gray-600"
                        : "bg-[#6B7280] hover:bg-[#6B7280]/90"
                    } 
                    text-white flex items-center justify-center`}
                >
                  {isLoading ? "Saving..." : "Save & Next"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold">Branch Details</h3>
              <p className="text-[#697282] text-sm">
                here information about your institution&apos;s branches.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {branches.map((branch) => (
                  <div key={branch.id} className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                        selectedBranchId === branch.id
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{branch.branchName || `Branch ${branch.id}`}</span>
                      {branches.length > 1 && (
                        <MoreVertical
                          size={14}
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBranch(branch.id);
                          }}
                        />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={addNewBranch}
                className="bg-[#0222D7] hover:bg-[#0222D7]/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Add Branch
              </Button>
            </div>

            <div className="b p-4 rounded-md">
              <BranchForm
                branches={branches}
                selectedBranchId={selectedBranchId}
                handleBranchChange={handleBranchChange}
                handleBranchSubmit={handleBranchSubmit}
                handlePreviousClick={onPrevious}
                isLoading={isLoading}
                errors={branchErrors[selectedBranchId] || {}}
              />
            </div>

            {showCourseAfterBranch && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {isStudyHall
                      ? "Study Hall"
                      : isTutionCenter
                      ? "Tuition Hall"
                      : isSubscriptionProgram
                      ? "Program Details"
                      : "Course Details"}
                  </h3>
                  <p className="text-[#697282] text-sm">
                    {isStudyHall
                      ? "Enter the details of the study hall."
                      : isTutionCenter
                      ? "Enter the details of the tuition hall."
                      : isSubscriptionProgram
                      ? "Enter the programs your institution offers."
                      : "Enter the courses your institution offers."}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-2 flex-wrap">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedCourseId(course.id)}
                          className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                            selectedCourseId === course.id
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>
                            {course.courseName ||
                              (isStudyHall
                                ? `Hall ${course.id}`
                                : isTutionCenter
                                ? `Hall ${course.id}`
                                : isSubscriptionProgram
                                ? `Program ${course.id}`
                                : `Course ${course.id}`)}
                          </span>
                          {courses.length > 1 && (
                            <MoreVertical
                              size={14}
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCourse(course.id);
                              }}
                            />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div> */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {courses.map((course, index) => (
                      <div key={course.id} className="flex items-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedCourseId(course.id)}
                          className={`px-3 py-2 rounded-lg text-sm border transition-colors flex items-center gap-2 ${
                            selectedCourseId === course.id
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>
                            {course.courseName ||
                              (isStudyHall
                                ? `Hall ${index + 1}`
                                : isTutionCenter
                                ? `Tuition ${index + 1}`
                                : isSubscriptionProgram
                                ? `Program ${index + 1}`
                                : `Course ${index + 1}`)}
                          </span>

                          {courses.length > 1 && (
                            <MoreVertical
                              size={14}
                              className="text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCourse(course.id);
                              }}
                            />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={addNewCourse}
                    className="bg-[#0222D7] hover:bg-[#0222D7]/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Plus size={16} />
                    {isStudyHall
                      ? "Add Hall"
                      : isTutionCenter
                      ? "Add Hall"
                      : isSubscriptionProgram
                      ? "Add Program"
                      : "Add Course"}
                  </Button>
                </div>

                <form onSubmit={handleCourseSubmit} className="space-y-6">
                  <InputField
                    label="Branch"
                    name="createdBranch"
                    value={currentCourse.createdBranch}
                    onChange={handleCourseChange}
                    isSelect={true}
                    options={
                      branchOptions.length
                        ? branchOptions
                        : ["No branches saved yet"]
                    }
                    placeholder="Select branch"
                    error={courseErrorsById[currentCourse.id]?.createdBranch}
                  />

                  {isSubscriptionProgram && uniqueRemoteBranches.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Branch
                      </label>
                      <AppSelect
                        value={selectedBranchIdForProgram}
                        onChange={(val) => {
                          setSelectedBranchIdForProgram(val);
                          setProgramBranchError("");
                        }}
                        options={uniqueRemoteBranches.map((b) => ({
                          label: b.branchName,
                          value: b._id,
                        }))}
                        placeholder="Select Branch"
                        variant="white"
                        size="md"
                        rounded="lg"
                        className="w-full"
                      />
                      {programBranchError && (
                        <p className="text-red-600 text-xs mt-1">
                          {programBranchError}
                        </p>
                      )}
                    </div>
                  )}

                  {isStudyAbroad ? (
                    <StudyAbroadForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      handleFileChange={handleFileChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                    />
                  ) : isCoachingCenter ? (
                    <CoachingCourseForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                    />
                  ) : isStudyHall ? (
                    <StudyHallForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      handleOperationalDayChange={handleOperationalDayChange}
                      handleFileChange={handleFileChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                      labelVariant={
                        isSubscriptionProgram ? "program" : "course"
                      }
                    />
                  ) : isTutionCenter ? (
                    <TuitionCenterForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      handleOperationalDayChange={handleOperationalDayChange}
                      handleFileChange={handleFileChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                      labelVariant={
                        isSubscriptionProgram ? "program" : "course"
                      }
                    />
                  ) : isUnderPostGraduate ? (
                    <UnderPostGraduateForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                      labelVariant={
                        isSubscriptionProgram ? "program" : "course"
                      }
                    />
                  ) : isBasicCourseForm ? (
                    <BasicCourseForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                      labelVariant={
                        isSubscriptionProgram ? "program" : "course"
                      }
                    />
                  ) : (
                    <FallbackCourseForm
                      currentCourse={currentCourse}
                      handleCourseChange={handleCourseChange}
                      setCourses={setCourses}
                      courses={courses}
                      selectedCourseId={selectedCourseId}
                      courseErrors={courseErrorsById[currentCourse.id] || {}}
                      labelVariant={
                        isSubscriptionProgram ? "program" : "course"
                      }
                    />
                  )}
                  {!isStudyHall && !isTutionCenter && !isStudyAbroad && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {uploadFields.map((f) => (
                        <div key={f.type} className="flex flex-col gap-2">
                          <label className="font-medium text-[16px]">
                            {f.label} <span className="text-red-500">*</span>
                          </label>

                          <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
                            {(() => {
                              const previewUrl = currentCourse[
                                `${f.type}PreviewUrl`
                              ] as string;

                              if (previewUrl) {
                                if (f.type === "image") {
                                  return (
                                    <Image
                                      src={previewUrl}
                                      alt={`${f.label} Preview`}
                                      className="object-cover w-full h-full rounded-[12px]"
                                      width={100}
                                      height={100}
                                    />
                                  );
                                } else {
                                  return (
                                    <div className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
                                      <span className="text-sm text-gray-500 truncate">
                                        {(() => {
                                          if (
                                            currentCourse[f.type] instanceof
                                            File
                                          ) {
                                            return (
                                              currentCourse[f.type] as File
                                            ).name;
                                          }

                                          const url =
                                            currentCourse[`${f.type}Url`];
                                          if (url) {
                                            const rawName = decodeURIComponent(
                                              url
                                                .split("/")
                                                .pop()
                                                ?.split("?")[0] || ""
                                            );
                                            // 🧹 remove timestamp prefix (e.g. "1762336776327-")
                                            const cleanName = rawName.replace(
                                              /^\d+-/,
                                              ""
                                            );
                                            return cleanName;
                                          }

                                          return "No file selected";
                                        })()}
                                      </span>
                                    </div>
                                  );
                                }
                              }

                              return (
                                <>
                                  <Upload
                                    size={24}
                                    className="text-gray-400 dark:text-gray-300 mb-2"
                                  />
                                  <span className="text-sm text-gray-500 dark:text-gray-300">
                                    {f.type === "image"
                                      ? "Upload Course Image (jpg / jpeg / png)"
                                      : "Upload Course Brochure (pdf)"}
                                  </span>
                                </>
                              );
                            })()}

                            <input
                              type="file"
                              accept={f.accept}
                              className="absolute inset-0 opacity-0 cursor-pointer dark:bg-gray-800"
                              onChange={(e) => handleFileChange(e, f.type)}
                            />
                          </label>
                          {courseErrorsById[currentCourse.id]?.[
                            `${f.type}Url`
                          ] && (
                            <p className="text-red-500 text-sm mt-1">
                              {
                                courseErrorsById[currentCourse.id][
                                  `${f.type}Url`
                                ]
                              }
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center gap-10">
                    <button
                      type="button"
                      onClick={onPrevious}
                      className="w-[314px] h-[48px] border border-[#697282] text-[#697282] rounded-[12px] font-semibold text-[18px] leading-[22px] flex items-center justify-center shadow-inner"
                    >
                      Previous
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-[314px] h-[48px] rounded-[12px] font-semibold transition-colors 
                        ${
                          isLoading
                            ? "opacity-50 cursor-not-allowed bg-gray-600"
                            : "bg-[#6B7280] hover:bg-[#6B7280]/90"
                        } 
                        text-white flex items-center justify-center`}
                    >
                      {isLoading ? "Saving..." : "Save & Next"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </_CardContent>
    </_Card>
  );

  if (renderMode === "inline") {
    return content;
  }

  return (
    <>
      <_Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
        {trigger && <_DialogTrigger asChild>{trigger}</_DialogTrigger>}
        <_DialogContent
          className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide top-[65%]"
          showCloseButton={false}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {content}
        </_DialogContent>
      </_Dialog>
    </>
  );
}