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
  institution?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
  role: string;
  googleId?: string;
  profilePicture?: string;
  address?: string;
  birthday?: string;
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
  login: async( loginData: LoginData) => {
    try {
      // const response = await authAPI.login({ email, password, type });
      const response = await authAPI.login(loginData);
      if (response.success) {
        const responseData = response.data as Record<string, unknown>;
        const data = responseData?.user || responseData;
        if (data && typeof data === 'object' && ((data as Record<string, unknown>).id || (data as Record<string, unknown>).email)) {
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
            name: userData.name as string,
            institution: (userData.institution as string) || ",",
            isPaymentDone: (userData.isPaymentDone as boolean) ?? false,
            isProfileCompleted: (userData.isProfileCompleted as boolean) ?? false,
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
      if (process.env.NODE_ENV === 'development') console.error("Login error:", e);
      return false;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error("Logout error:", e);
    } finally {
      get().setUser(null);
    }
  },

  refreshUser: async () => {
    try {
      set({ loading: true });
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        const data = response.data as Record<string, unknown>;
        const u: User = {
          id: "",
          email: data.email as string,
          admin: "",
          phone: data.contactNumber as string,
          designation: (data.designation as string) || "",
          linkedin: (data.linkedin as string) || "",
          verified: true,
          name: data.name as string,
          institution: (data.institution as string) || ",",
          isPaymentDone: (data.isPaymentDone as boolean) || false,
          isProfileCompleted: (data.isProfileCompleted as boolean) || false,
          role: (data.role as string) || "",
          googleId: data.googleId as string,
          profilePicture: (data.profilePicture as string) || "",
          address: (data.address as string) || "",
          birthday: (data.birthday as string) || "",
        };
        set({ user: u, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error("Refresh user error:", e);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));