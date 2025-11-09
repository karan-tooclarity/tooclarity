"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
  _DialogDescription,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";
import { authAPI } from "../../lib/api";
import OtpDialogBox from "./OtpDialogBox";
import { useAuth } from "../../lib/auth-context";
import { redirectToGoogleOAuth } from "@/lib/google-auth";
import Image from "next/image";

type SignUpCaller = "admin" | "institution";

interface SignUpDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  caller?: SignUpCaller;
  onSuccess?: (email: string) => void; // called after successful verification
}

export default function SignUpDialog({
  open: externalOpen,
  onOpenChange,
  caller,
  onSuccess,
}: SignUpDialogProps = {}) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    designation: "",
    linkedin: "",
    password: "",
    repassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Password strength regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Admin Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Phone number must be exactly 10 digits.";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required.";
    }

    if (caller !== "admin" && !formData.linkedin.trim()) {
      newErrors.linkedin = "LinkedIn profile is required.";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number and special character.";
    }

    if (formData.password !== formData.repassword) {
      newErrors.repassword = "Passwords do not match.";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms & conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API (exclude repassword)
      const { repassword, ...signUpData } = formData;

      const response = await authAPI.signUp({ ...signUpData, type: caller });

      // Check for successful registration
      if (response.success) {
        // Close signup _Dialog
        setOpen(false);
        if (caller === "admin") {
          await refreshUser();
          router.push('/dashboard');
        } else if (caller === "institution") {
          onSuccess?.(formData.email);
          setOpen(false);
        }
      } else {
        setErrors({
          general: response.message || "Sign up failed. Please try again.",
        });
      }
    } catch {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    // Handle successful verification
    // alert("Account verified successfully! Welcome to Too Clarity!");

    // Reset form
    setFormData({
      name: "",
      email: "",
      contactNumber: "",
      designation: "",
      linkedin: "",
      password: "",
      repassword: "",
    });
    setAcceptTerms(false);

    // If parent wants to handle success (e.g., admin-login -> dashboard), delegate
    if (onSuccess) {
      onSuccess(formData.email);
      return;
    }

    // Default: Redirect to /signup page
    router.push('/signup');
  };

  const handleGoogleSignUp = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "";

    if (!clientId || !redirectUri) {
      console.error("Missing Google OAuth configuration");
      return;
    }

    const userType = "institution";
    const type = "register"
    const state = JSON.stringify({ state: "institution", type: "register", device: "web" });

    redirectToGoogleOAuth({ clientId, redirectUri, userType, state, type });
  };

  return (
    <>
      <_Dialog open={open} onOpenChange={setOpen}>
        <_DialogContent 
          className="max-w-lg flex flex-col justify-between scrollbar-hide"
          overlayClassName="bg-black/50"
        >
          <_DialogHeader className="flex flex-col items-center gap-2">
            <_DialogTitle className="max-w-xs font-montserrat font-bold text-xl sm:text-[24px] leading-tight text-center">
              Welcome Aboard!
            </_DialogTitle>
            <_DialogDescription className="max-w-xs font-montserrat font-normal text-sm sm:text-[14px] leading-relaxed text-center">
              Let&apos;s finalize your details.
            </_DialogDescription>
          </_DialogHeader>

          <div className="grid gap-6 flex-1">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">
                  {errors.general}
                </p>
              </div>
            )}

            {[
              { label: "Admin Name", id: "name", formKey: "name" },
              {
                label: "Mail ID",
                id: "email",
                formKey: "email",
                type: "email",
              },
              {
                label: "Phone Number",
                id: "phone",
                formKey: "contactNumber",
                type: "tel",
              },
              {
                label: "Designation",
                id: "designation",
                formKey: "designation",
              },
              // Only include LinkedIn when not admin
              ...(caller === "admin" ? [] : [{ label: "LinkedIn", id: "linkedin", formKey: "linkedin" }]),
            ].map((f: Record<string, unknown>) => (
              <div key={f.id as string}>
                {f.id === "phone" ? (
                  <InputField
                    label={f.label as string}
                    name={f.formKey as string}
                    type="tel"
                    placeholder="+91 0000000000"
                    value={formData.contactNumber}
                    numericOnly
                    pattern="[0-9]*"
                    maxLength={10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    required={true}
                    error={errors[f.formKey as string]}
                    icon={
                      <Image
                        src="/India-flag.png"
                        alt="India Flag"
                        width={24}
                        height={16}
                        className="w-6 h-4 object-cover rounded-sm"
                      />
                    }
                  />
                ) : (
                  <InputField
                    label={f.label as string}
                    name={f.formKey as string}
                    type={(f.type as string) || "text"}
                    placeholder={`Enter your ${f.label as string}`}
                    value={formData[f.formKey as keyof typeof formData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [f.formKey as string]: e.target.value })
                    }
                    required={true}
                    error={errors[f.formKey as string]}
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={true}
                error={errors.password}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />

              {/* Re-enter Password */}
              <InputField
                label="Re-enter Password"
                name="repassword"
                type={showRePassword ? "text" : "password"}
                placeholder="Re-enter your Password"
                value={formData.repassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    repassword: e.target.value,
                  })
                }
                required={true}
                error={errors.repassword}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />
            </div>

            {/* Accept Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                id="terms"
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 accent-blue-600"
              />
              <label
                htmlFor="terms"
                className="text-sm sm:text-base leading-relaxed cursor-pointer"
              >
                Accept <Link href="/TermsConditions" className="text-blue-600 hover:underline">
          Terms and Conditions*
        </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 mt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !acceptTerms}
              className={`w-full h-12 sm:h-[48px] rounded-[12px] px-4 py-3 gap-2 font-semibold ${
                acceptTerms && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white"
              }`}
            >
              {loading ? "Creating Account..." : "Submit"}
            </Button>

            <div className="text-center text-gray-500 mt-2">or</div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} className="w-5 h-5" />
              Sign up with Google
            </button>
          </div>
        </_DialogContent>
      </_Dialog>

      {/* OTP Verification _Dialog */}
      <OtpDialogBox
        open={openVerify}
        setOpen={setOpenVerify}
        email={formData.email}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
}