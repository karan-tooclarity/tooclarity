// utility.ts
import {
  getAllInstitutionsFromDB,
  getCoursesGroupsByBranchName,
} from "@/lib/localDb"; // update import paths
import { institutionAPI, type ApiResponse } from "@/lib/api";
import { useUserStore } from "@/lib/user-store";

interface CourseWithPreviews {
  id?: string | number;              // was: string
  image?: File | null;               // was: File
  imagePreviewUrl?: string;
  brochure?: File | null;            // was: File
  brochurePreviewUrl?: string;
  consultancyName?: string;
  studentAdmissions?: string;
  countriesOffered?: string | string[];
  academicOfferings?: string | string[];
  businessProofUrl?: string;
  panAadhaarUrl?: string;
  [key: string]: unknown;
}

interface BranchWithCourses {
  id?: string | number;              // was: string
  createdAt?: number;                // was: number
  courses: CourseWithPreviews[];
  [key: string]: unknown;
}

interface InstitutionWithPreviews {
  logoPreviewUrl?: string;
  instituteType?: string;
  consultancyName?: string;
  totalAdmissions?: number;
  countries?: string[];
  academicOfferings?: string[];
  businessProofUrl?: string;
  legalIdUrl?: string;
  [key: string]: unknown;
}


/**
 * Fetch institution + courses and wrap into a JSON File
 */
export async function exportInstitutionAndCoursesToFile(): Promise<File> {
  // 1) Fetch all institutions (should usually be only 1 latest)
  const institutions = await getAllInstitutionsFromDB();
  const latestInstitution =
    institutions.length > 0
      ? institutions.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))[0]
      : null;

  let sanitizedInstitution = latestInstitution
    ? (() => {
      // Remove local-only preview URLs before exporting
      const { logoPreviewUrl, ...restInstitution } = latestInstitution as InstitutionWithPreviews;
      return restInstitution;
    })()
    : null;

  // 2) Fetch all courses grouped by branch
  const coursesGroups = await getCoursesGroupsByBranchName();

  const sanitizedCourses = coursesGroups.map((branch: BranchWithCourses) => {
    // Sanitize branch data
    const { id, createdAt, ...branchRest } = branch;
    return {
      ...branchRest,
      // Sanitize course data, removing local Files and preview URLs
      courses: branch.courses.map((course: CourseWithPreviews) => {
        const { id, image, imagePreviewUrl, brochure, brochurePreviewUrl, ...courseRest } = course;
        return courseRest;
      }),
    };
  });

  // 3) Special handling for Study Abroad: promote key L2/L3 fields onto institution
  if (sanitizedInstitution && sanitizedInstitution.instituteType === 'Study Abroad') {
    // Find the first course that contains the consultancy metadata
    let meta: CourseWithPreviews | null = null;

    for (const group of coursesGroups) {
      meta = (group.courses || []).find((c: CourseWithPreviews) =>
        c.consultancyName ||
        c.studentAdmissions ||
        c.countriesOffered ||
        c.academicOfferings
      ) ?? null; // ✅ ensures meta is never undefined
      if (meta) break;
    }


    if (meta) {
      // Map course fields to the institution fields as expected by the backend
      sanitizedInstitution = {
        ...sanitizedInstitution,
        consultancyName: sanitizedInstitution.consultancyName ?? meta.consultancyName ?? '',
        totalAdmissions: sanitizedInstitution.totalAdmissions ?? Number(meta.studentAdmissions || 0),
        countries: sanitizedInstitution.countries ?? (Array.isArray(meta.countriesOffered) ? meta.countriesOffered : (meta.countriesOffered ? String(meta.countriesOffered).split(',').map((s: string) => s.trim()).filter(Boolean) : [])),
        academicOfferings: sanitizedInstitution.academicOfferings ?? (Array.isArray(meta.academicOfferings) ? meta.academicOfferings : (meta.academicOfferings ? String(meta.academicOfferings).split(',').map((s: string) => s.trim()).filter(Boolean) : [])),
        businessProofUrl: sanitizedInstitution.businessProofUrl ?? meta.businessProofUrl ?? '',
        legalIdUrl: sanitizedInstitution.legalIdUrl ?? meta.panAadhaarUrl ?? '',
      };
    }
  }

  // 4) Build final JSON payload
  const exportData = {
    institution: sanitizedInstitution,
    courses: sanitizedCourses,
    exportedAt: new Date().toISOString(),
  };

  // 5) Convert to a file
  const jsonString = JSON.stringify(exportData, null, 2);
  const file = new File([jsonString], "institution_and_courses.json", {
    type: "application/json",
  });

  return file;
}

/**
 * Export institution + courses to a JSON file and upload to backend
 */
export async function exportAndUploadInstitutionAndCourses(): Promise<ApiResponse> {
  const file = await exportInstitutionAndCoursesToFile();

  const response = await institutionAPI.uploadInstitutionFile(file);

  if (response.success) {
    // Clear local data upon successful upload
    localStorage.clear();
    indexedDB.deleteDatabase("tooclarity");

    // Mark profile as completed to allow navigation to the next step (e.g., payment)
    try {
      useUserStore.getState().setProfileCompleted(true);
    } catch (e) {
      console.warn("[Utility] Failed to set isProfileCompleted in store:", e);
    }
  }

  return response;
}

/**
 * Check if a program/course is currently active based on its start and end dates.
 */
export function isProgramActive(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  return now >= start && now <= end;
}

/**
 * Get a detailed status of a program (e.g., active, upcoming, expired).
 */
export function getProgramStatus(startDate: string, endDate: string): {
  status: 'active' | 'inactive' | 'upcoming' | 'expired' | 'invalid';
  message: string;
  daysRemaining?: number;
} {
  if (!startDate || !endDate) {
    return {
      status: 'invalid',
      message: 'Invalid dates'
    };
  }

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      status: 'invalid',
      message: 'Invalid date format'
    };
  }

  if (now < start) {
    const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'upcoming',
      message: `Starts in ${daysUntilStart} days`,
      daysRemaining: daysUntilStart
    };
  }

  if (now > end) {
    const daysSinceEnd = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'expired',
      message: `Ended ${daysSinceEnd} days ago`
    };
  }

  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return {
    status: 'active',
    message: `${daysRemaining} days remaining`,
    daysRemaining
  };
}

/**
 * Format a date string for display (e.g., "Nov 5, 2025").
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'Not set';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
