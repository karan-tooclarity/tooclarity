"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useUserStore } from "@/lib/user-store";
import {
  GoogleCredentialResponse,
  initializeGoogleIdentity,
  loadGoogleIdentityScript,
  redirectToGoogleOAuth,
} from "@/lib/google-auth";


type OAuthProvider = {
  id: string;
  label: string;
  icon: string | LucideIcon;
};

interface StudentRegistrationProps {
  onSuccess?: () => Promise<void>;
  onOtpRequired?: (phoneNumber: string) => void;
}

const oauthProviders: OAuthProvider[] = [
  {
    id: "google",
    label: "Continue with Google",
    icon: "/google.png",
  },
];

const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  onSuccess,
  onOtpRequired,
}) => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contactNumber: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegisterSuccess = useCallback(async () => {
    await refreshUser();
    if (onSuccess) await onSuccess();

    const latestUser = useUserStore.getState().user;
    const role = latestUser?.role;
    const isProfileCompleted = !!latestUser?.isProfileCompleted;

    if (role === "STUDENT") {
      router.replace(
        isProfileCompleted ? "/dashboard" : "/student/onboarding"
      );
    }
  }, [refreshUser, onSuccess, router]);

  // 🔹 Google Identity
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return console.error("Missing GOOGLE_CLIENT_ID");

    let isMounted = true;
    (async () => {
      const loaded = await loadGoogleIdentityScript();
      if (!loaded) return console.error("Failed to load Google script");

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
            if (!response.success)
              throw new Error(response.message || "Google sign-up failed");
            await handleRegisterSuccess();
          } catch (err) {
            console.error("Google auth error:", err);
          } finally {
            setLoadingProvider(null);
          }
        },
      });

      if (isMounted) setIsScriptLoaded(true);
    })();

    return () => {
      isMounted = false;
    };
  }, [handleRegisterSuccess]);

  // 🔹 Google click handler
  const handleGoogleClick = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";
    const state = JSON.stringify({
      state: "student",
      type: "register",
      device: "web",
    });
    redirectToGoogleOAuth({
      clientId,
      redirectUri,
      userType: "student",
      state,
      type: "register",
    });
  }, []);

  // 🔹 Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
  };

  // 🔹 Form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const sanitizedPhone = formData.contactNumber.replace(/\D/g, "");

    if (!/^\d{10}$/.test(sanitizedPhone)) {
      return setFormError("Phone number must be exactly 10 digits.");
    }

    if (formData.password.length < 6) {
      return setFormError("Password must be at least 6 characters long.");
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.signUp({
        contactNumber: sanitizedPhone,
        password: formData.password,
        type: "student",
      });

      if (!response.success)
        return setFormError(response.message || "Registration failed.");

      if (onOtpRequired) {
        onOtpRequired(sanitizedPhone);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Providers
  const renderedProviders = useMemo(
    () =>
      oauthProviders.map((provider) => {
        const isGoogle = provider.id === "google";
        const isLoading = loadingProvider === provider.id;
        const disabled = isGoogle && !isScriptLoaded;

        return (
          <button
            key={provider.id}
            type="button"
            onClick={isGoogle ? handleGoogleClick : undefined}
            disabled={disabled}
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
                />
              )}
            </span>
            <span>{disabled ? "Loading Google..." : provider.label}</span>
          </button>
        );
      }),
    [isScriptLoaded, loadingProvider, handleGoogleClick]
  );

  return (
    <section className="flex min-h-screen flex-col bg-gradient-to-b from-white via-white to-blue-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-16">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center gap-3 text-blue-600">
          {/* <button
            onClick={() => router.back()}
            className="rounded-full p-1 transition hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button> */}
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Enter your phone number and password to register.
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                maxLength={10}
                onChange={handleInputChange}
                inputMode="numeric"
                placeholder="+91 Mobile number"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </label>

          <label className="block">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-12 text-base text-gray-900 outline-none transition hover:border-blue-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-2 flex h-8 w-8 items-center justify-center text-gray-500 transition hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          {formError && (
            <p className="text-sm text-red-500 text-center font-medium">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/student/login")}
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign in
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

export default StudentRegistration;
