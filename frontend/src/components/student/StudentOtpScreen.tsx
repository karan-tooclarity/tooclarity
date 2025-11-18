"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { authAPI } from "@/lib/api";
interface StudentOtpScreenProps {
  phoneNumber?: string;
  _onVerify?: (otp: string) => Promise<void>;
  onBack?: () => void;
  onSuccess?: () => void;
}

const StudentOtpScreen: React.FC<StudentOtpScreenProps> = ({
  phoneNumber = "",
  // _onVerify,
  // onBack,
  onSuccess,
}) => {
  // const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError(null);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyOTP({
        otp: otpString,
        contactNumber: phoneNumber,
      });

      if (response?.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      const response = await authAPI.resendOTP({
        contactNumber: phoneNumber,
      });

      if (response?.success) {
        setResendTimer(30);
        setCanResend(false);
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };



  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <div className="mt-8 flex-1">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Verify account with OTP
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            We have sent a 6-digit code to {phoneNumber}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-1 sm:gap-1 md:gap-4 lg:gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isLoading}
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-blue-200 focus:border-blue-400"
                  }`}
              />
            ))}
          </div>

            {/* Resend OTP */}
            <div className="text-sm text-gray-600">
              <span>Didn&apos;t get a code? </span>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-blue-600 font-medium">
                  Resend OTP in 0:{resendTimer.toString().padStart(2, "0")}
                </span>
              )}
            </div>
          </div>
        </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleVerifyOtp}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full rounded-2xl bg-gray-300 py-3 text-base font-semibold text-gray-600 transition hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <button className="text-gray-700 hover:underline">T&C</button> and{" "}
          <button className="text-gray-700 hover:underline">
            Privacy policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default StudentOtpScreen;
