// Student-specific API configuration placeholder

import { apiRequest, type ApiResponse } from "./api";

export type StudentApiResponse<T = unknown> = ApiResponse<T>;

// This helper mirrors the admin API setup but leaves implementation stubs for now
async function studentApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<StudentApiResponse<T>> {
  // Delegate to shared request helper to keep behavior consistent
  return apiRequest<T>(endpoint, options);
}

// ===== Student Authentication Types =====
export interface StudentLoginData {
  email: string;
  password: string;
}

// ===== Student Dashboard Types =====
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  birthday?: string; // ISO or raw string if backend provides
  address?: string;
}

export interface StudentCourse {
  id: string;
  title: string;
  progress: number; // 0-100
  enrolledAt: string;
  completedAt?: string | null;
}

export interface StudentListParams {
  search?: string;
  page?: number;
  limit?: number;
}

// ===== Onboarding types =====
export interface CreateStudentPayload {
  name: string;
  email: string;
  contactNumber?: string;
  address?: string;
  googleId?: string;
}

// Define specific types for different academic profile details
export interface KindergartenDetails {
  ageGroup?: string;
  programType?: string;
  // Add other kindergarten-specific fields
}

export interface SchoolDetails {
  grade?: string;
  board?: string;
  // Add other school-specific fields
}

export interface GraduationDetails {
  degree?: string;
  major?: string;
  university?: string;
  // Add other graduation-specific fields
}

export interface CoachingCenterDetails {
  course?: string;
  examType?: string;
  // Add other coaching-specific fields
}

export type AcademicProfileDetails = 
  | KindergartenDetails 
  | SchoolDetails 
  | GraduationDetails 
  | CoachingCenterDetails
  | Record<string, unknown>;

export interface UpdateAcademicProfilePayload {
  profileType:
    | "KINDERGARTEN"
    | "SCHOOL"
    | "INTERMEDIATE"
    | "GRADUATION"
    | "COACHING_CENTER"
    | "STUDY_HALLS"
    | "TUITION_CENTER"
    | "STUDY_ABROAD";
  details: AcademicProfileDetails;
}

// ===== Course Types for Student Dashboard =====
export interface CourseForStudent {
  _id: string;
  id?: string;
  courseName: string;
  aboutCourse?: string;
  priceOfCourse?: number;
  mode?: "Offline" | "Online" | "Hybrid";
  imageUrl?: string;
  brochureUrl?: string;
  startDate?: string;
  endDate?: string;
  courseDuration?: string;
  location?: string;
  institution?: {
    _id: string;
    instituteName: string;
    instituteLogo?: string;
    instituteType?: string; // Added for institute-specific course page rendering
  };
  rating?: number;
  reviews?: number;
  studentsEnrolled?: number;
  // Additional fields for Study Hall
  operationalDays?: string[];
  openingTime?: string;
  closingTime?: string;
  hasWifi?: string;
  hasChargingPoints?: string;
  hasAC?: string;
  hasPersonalLocker?: string;
  seatingOption?: string;
  // Additional fields
  eligibilityCriteria?: string;
  type?: "PROGRAM" | "COURSE";
}

// ===== Student Dashboard API (stubs) =====
export const studentDashboardAPI = {
  // Fetch the current user's profile (shared profile endpoint)
  getProfile: async (): Promise<StudentApiResponse<StudentProfile>> => {
    const res = await studentApiRequest<StudentProfile>("/v1/profile", { method: "GET" });
    // Normalize shape to StudentProfile best-effort
    const rawData = res.data || res;
    const data = typeof rawData === 'object' && rawData !== null ? rawData : {};
    
    const normalized: StudentProfile = {
      id: (data as Record<string, unknown>)?.id as string || (data as Record<string, unknown>)?._id as string || "",
      name: (data as Record<string, unknown>)?.name as string || "",
      email: (data as Record<string, unknown>)?.email as string || "",
      phoneNumber: (data as Record<string, unknown>)?.contactNumber as string | undefined,
      profilePicture: (data as Record<string, unknown>)?.profilePicture as string || (data as Record<string, unknown>)?.ProfilePicutre as string, // backend may use ProfilePicutre
      birthday: (data as Record<string, unknown>)?.birthday as string | undefined, // if backend provides
    };
    
    return { success: true, message: "ok", data: normalized };
  },

  // Fetch all visible courses (public endpoint - no auth required)
  getVisibleCourses: async (): Promise<StudentApiResponse<CourseForStudent[]>> => {
    return studentApiRequest<CourseForStudent[]>("/v1/public/courses", {
      method: "GET",
    });
  },

  // Fetch courses the student is enrolled in
  listCourses: async (
    params: StudentListParams = {}
  ): Promise<StudentApiResponse<{ items: StudentCourse[]; total: number }>> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();

    return studentApiRequest(`/v1/student/courses${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  // Update student profile details
  updateProfile: async (
    payload: Partial<StudentProfile>
  ): Promise<StudentApiResponse<StudentProfile>> => {
    return studentApiRequest("/v1/student/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

// ===== Onboarding API =====
export const studentOnboardingAPI = {
  createStudent: async (
    payload: CreateStudentPayload
  ): Promise<StudentApiResponse<unknown>> => {
    return studentApiRequest("/v1/students", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateAcademicProfile: async (
    payload: UpdateAcademicProfilePayload
  ): Promise<StudentApiResponse<unknown>> => {
    return studentApiRequest(`/v1/students/academic-profile`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};

// ===== Student Authentication API =====
export const studentAuthAPI = {
  // Student login
  login: async (loginData: StudentLoginData): Promise<StudentApiResponse> => {
    return studentApiRequest("/v1/student/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },
};