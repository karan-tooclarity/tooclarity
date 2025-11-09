"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  Smartphone,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { authAPI, LoginData } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  GoogleCredentialResponse,
  redirectToGoogleOAuth,
} from "@/lib/google-auth";


type OAuthProvider = {
  id: string;
  label: string;
  icon: string | LucideIcon;
};

const oauthProviders: OAuthProvider[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: "/google.png",
  },
//   {
//     id: "microsoft",
//     label: "Continue with Microsoft",
//     icon: "/window.svg",
//   },
//   {
//     id: "apple",
//     label: "Continue with Apple",
//     icon: Apple,
//   },
];

interface StudentLoginProps {
  onSuccess?: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login,refreshUser } = useAuth();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<LoginData>({
    contactNumber: "",
    password: "",
    type: "student",

  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Google Script
  React.useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
      return;
    }

    let isMounted = true;

    const initialize = async () => {
      const loaded = await loadGoogleIdentityScript();
      if (!loaded) {
        console.error("Failed to load Google Identity Services script");
        return;
      }

      try {
        initializeGoogleIdentity({
          clientId,
          autoSelect: false,
          uxMode: "redirect",
          callback: async ({ credential }: GoogleCredentialResponse) => {
            if (!credential) {
              setLoadingProvider(null);
              return;
            }

            try {
              const response = await authAPI.googleAuth(credential);
              if (!response.success) {
                console.error("Google sign-in failed", response.message);
                return;
              }

              await refreshUser();
              
              // If parent provided a success handler, use it
              if (onSuccess) {
                onSuccess();
                return;
              }

            } catch (error) {
              console.error("Error sending Google token", error);
            } finally {
              setLoadingProvider(null);
            }
          },
        });

        if (isMounted) setIsScriptLoaded(true);
      } catch (error) {
        console.error("Failed to initialize Google Identity Services", error);
      }
    };

    void initialize();
    return () => {
      isMounted = false;
    };
  }, [refreshUser, router, onSuccess]);

  const handleGoogleClick = useCallback (() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
    const state = JSON.stringify({ state: "student", type: "login", device: "web" });
    redirectToGoogleOAuth({
      clientId,
      redirectUri,
      userType: "student",
      state: state,
      type: "login",
    });
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      
      if (!response) {
        setError(response || "Login failed");
        return;
      }

      await refreshUser();
      
      if (onSuccess) {
        onSuccess();
        return;
      }

      router.replace("/student/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderedProviders = useMemo(
    () =>
      oauthProviders.map((provider) => {
        const isGoogle = provider.id === "google";
        const isLoading = loadingProvider === provider.id;
        const disableGoogleButton = isGoogle && !isScriptLoaded;

        if (typeof provider.icon === "function") {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={isGoogle ? handleGoogleClick : undefined}
              disabled={disableGoogleButton}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <span>
                {disableGoogleButton ? "Loading Google..." : provider.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={provider.id}
            type="button"
            onClick={isGoogle ? handleGoogleClick : undefined}
            disabled={disableGoogleButton}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Image
                  src={provider.icon as string}
                  alt={provider.label}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              )}
            </span>
            <span>
              {disableGoogleButton ? "Loading Google..." : provider.label}
            </span>
          </button>
        );
      }),
    [handleGoogleClick, isScriptLoaded, loadingProvider]
  );

  return (
    <section className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center gap-3 text-blue-600">
          <button className="rounded-full p-1 transition hover:bg-blue-50">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </header>

        <div className="mb-8 flex flex-col items-center">
          <div className="grid place-items-center rounded-full p-6">
            <Image
              src="/Too Clarity.png"
              alt="Too Clarity Logo"
              width={120}
              height={60}
              priority
            />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account.
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {/* Error message */}
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email field */}
          <label className="block">
            <span className="sr-only">Mobile number</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Smartphone className="h-5 w-5" />
              </span>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter your Mobile Number"
                required
                disabled={isLoading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </label>

          {/* Password field */}
          <label className="block">
            <span className="sr-only">Password</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading || !formData.contactNumber || !formData.password}
            className="w-full rounded-2xl bg-blue-600 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button className="font-semibold text-blue-600 hover:underline">
            Sign up
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          <span>OR</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="mt-6 space-y-3">{renderedProviders}</div>
      </div>
    </section>
  );
};

export default StudentLogin;
