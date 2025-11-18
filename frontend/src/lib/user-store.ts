"use client";

import { create } from "zustand";
import { authAPI, LoginData } from "./api";

// Keep this in sync with existing app expectations
export interface User {
  id: string;
  name: string;
  email: string;
  admin: string;
  phone?: string;
  designation?: string;
  linkedin?: string;
  verified: boolean;
  isPhoneVerified?: boolean;
  institution?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
  role: string;
  googleId?: string;
  profilePicture?: string;
  address?: string;
  birthday?: string;
  callRequestCount?: number;
  wishlistCount?: number;
  requestDemoCount?: number;
}

interface UserProfileResponse {
  id: string;
  email: string;
  contactNumber?: string;
  designation?: string;
  linkedin?: string;
  isPhoneVerified?: boolean;
  name: string;
  institution?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
  role: string;
  googleId?: string;
  ProfilePicture?: string;
  address?: string;
  birthday?: string;
  callRequestCount?: number;
  wishlistCount?: number;
  requestDemoCount?: number;
}

interface UserStoreState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
  // login: (email: string, password: string, type?: "admin" | "institution" | "student") => Promise<boolean>;
  login: (loginData: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: !!user,
    })),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
      isAuthenticated: !!(state.user || updates),
    })),

  setPaymentStatus: (isPaymentDone) =>
    set((state) => ({
      user: state.user ? { ...state.user, isPaymentDone } : state.user,
    })),

  setProfileCompleted: (isProfileCompleted) =>
    set((state) => ({
      user: state.user ? { ...state.user, isProfileCompleted } : state.user,
    })),

  // login: async (email: string, password: string, type?: "admin" | "institution" | "student") => {
  login: async (loginData: LoginData) => {
    try {
      // const response = await authAPI.login({ email, password, type });
      const response = await authAPI.login(loginData);
      if (response.success) {
        const responseData = response.data as Record<string, unknown>;
        const data = responseData?.user || responseData;
        if (
          data &&
          typeof data === "object" &&
          ((data as Record<string, unknown>).id ||
            (data as Record<string, unknown>).email)
        ) {
          // Normalize to User shape using available fields
          const userData = data as Record<string, unknown>;
          const user: User = {
            id: (userData.id as string) || "",
            email: userData.email as string,
            admin: (userData.admin as string) || "",
            phone: userData.contactNumber as string,
            designation: (userData.designation as string) || "",
            linkedin: (userData.linkedin as string) || "",
            verified: (userData.verified as boolean) ?? true,
            isPhoneVerified: (userData.isPhoneVerified as boolean) ?? false,
            name: userData.name as string,
            institution: (userData.institution as string) || ",",
            isPaymentDone: (userData.isPaymentDone as boolean) ?? false,
            isProfileCompleted:
              (userData.isProfileCompleted as boolean) ?? false,
            role: (userData.role as string) || "",
            googleId: userData.googleId as string,
            address: (userData.address as string) || "",
            birthday: (userData.birthday as string) || "",
            profilePicture: (userData.profilePicture as string) || "",
          };
          get().setUser(user);
          return true;
        }
        await get().refreshUser();
        return true;
      }
      return false;
    } catch (e) {
      if (process.env.NODE_ENV === "development")
        console.error("Login error:", e);
      return false;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      if (process.env.NODE_ENV === "development")
        console.error("Logout error:", e);
    } finally {
      get().setUser(null);
    }
  },

  refreshUser: async () => {
    try {
      set({ loading: true });
      const response = await authAPI.getProfile();

      if (response.success && response.data) {
        const data = response.data as UserProfileResponse;

        const u: User = {
          id: data.id,
          email: data.email,
          admin: "",
          phone: data.contactNumber,
          designation: data.designation || "",
          linkedin: data.linkedin || "",
          verified: true,
          isPhoneVerified: data.isPhoneVerified || false,
          name: data.name,
          institution: data.institution || "",
          isPaymentDone: data.isPaymentDone || false,
          isProfileCompleted: data.isProfileCompleted || false,
          role: data.role,
          googleId: data.googleId,
          profilePicture: data.ProfilePicture || "",
          address: data.address || "",
          birthday: data.birthday || "",
        };

        if (data.role === "STUDENT") {
          u.callRequestCount = data.callRequestCount ?? 0;
          u.wishlistCount = data.wishlistCount ?? 0;
          u.requestDemoCount = data.requestDemoCount ?? 0;
        }

        set({ user: u, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Refresh user error:", e);
      }
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));
