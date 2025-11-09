"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useUserStore, type User } from "./user-store";
import { LoginData } from "./api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // login: (email: string, password: string, type?: "admin" | "institution" | "student") => Promise<boolean>;
  login: (loginData: LoginData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => void;
  setPaymentStatus: (isPaymentDone: boolean) => void;
  setProfileCompleted: (isProfileCompleted: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    updateUser,
    setPaymentStatus,
    setProfileCompleted,
  } = useUserStore();

  // Initialize user on app start (skip on /test routes)
  useEffect(() => {
    /*try {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/test')) {
        return;
      }
    } catch {}*/
    refreshUser();
  }, [refreshUser]);

  const value: AuthContextType = {
    user,
    loading,
    // login: (email, password, type) => login(email, password, type),
    login: (loginData) => login(loginData),
    logout,
    refreshUser,
    isAuthenticated,
    updateUser,
    setPaymentStatus,
    setProfileCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}