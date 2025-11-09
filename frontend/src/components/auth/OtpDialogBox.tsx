import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
  _DialogDescription,
} from "@/components/ui/dialog";
import _InputField from "@/components/ui/InputField";
import { authAPI } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

interface Otp_DialogBoxProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  email: string;
  onVerificationSuccess: () => void;
}

export default function Otp_DialogBox({ 
  open, 
  setOpen, 
  email, 
  onVerificationSuccess 
}: Otp_DialogBoxProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { refreshUser } = useAuth();

  const router = useRouter();
  // Timer countdown
  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, timer]);

  // Reset state when _Dialog opens
  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimer(60);
      setCanResend(false);
    }
  }, [open]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.verifyOTP({
        email,
        otp: otpString,
      });

      if (response.success) {
        onVerificationSuccess();
        setOpen(false);
        await refreshUser();
        router.push("/signup");
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (_error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      const response = await authAPI.resendOTP({email: email});
      
      if (response.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        // Focus first input
        document.getElementById("otp-0")?.focus();
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (_error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <_Dialog open={open} onOpenChange={setOpen}>
      <_DialogContent
        className="max-w-lg flex flex-col justify-between scrollbar-hide"
        overlayClassName="bg-black/50"
      >
        <_DialogHeader className="flex flex-col items-center gap-2">
          <_DialogTitle className="max-w-xs font-montserrat font-bold text-xl sm:text-[24px] leading-tight text-center">
            Verify Your Email
          </_DialogTitle>
          <_DialogDescription className="max-w-xs font-montserrat font-normal text-sm sm:text-[14px] leading-relaxed text-center">
            We&apos;ve sent a 6-digit code to {email}
          </_DialogDescription>
        </_DialogHeader>

        <div className="grid gap-6 flex-1">
          {/* General Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* OTP Input Fields */}
          <div className="grid gap-2">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black text-center">
              Enter OTP Code
            </label>
            <div className="flex gap-2 sm:gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-base sm:text-lg font-semibold rounded-[12px] border border-[#DADADD] bg-[#F5F6F9] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-gray-500 text-sm">
                Resend code in {timer}s
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-blue-600 text-sm hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <Button
            type="button"
            onClick={handleVerifyOTP}
            disabled={loading || otp.join("").length !== 6}
            className={`w-full h-12 sm:h-[48px] rounded-[12px] px-4 py-3 gap-2 font-semibold ${
              !loading && otp.join("").length === 6
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Back to Sign Up */}
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 text-sm hover:underline"
          >
            Back to Sign Up
          </button>
        </div>
      </_DialogContent>
    </_Dialog>
  );
}