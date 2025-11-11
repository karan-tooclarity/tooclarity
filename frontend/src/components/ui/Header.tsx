"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import SignUpDialog from "../auth/SignUpDialog";
import LoginDialog from "../auth/LoginDialogBox";
import OtpDialogBox from "../auth/OtpDialogBox";

const Header: React.FC = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const router = useRouter();

  const handleSignUpSuccess = (email: string) => {
    // Close signup _Dialog
    setIsSignUpOpen(false);

    // Store email for OTP verification
    setOtpEmail(email);

    // Small delay to ensure clean modal transition
    setTimeout(() => setIsOtpOpen(true), 150);
  };

  const handleOtpVerified = () => {
    setIsOtpOpen(false);
    // Optional: show toast, navigate, or refresh user here

  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out opacity-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
      )}
      style={{ backgroundColor: "white" }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
          <Image src="/OO_black_whiteBG (1).png" alt="Logo" width={36} height={36} className="w-8 h-8 md:w-9 md:h-9" />
          <span className="ml-2 text-xl md:text-2xl font-bold text-gray-900">TOO CLARITY</span>
        </div>

        {/* Buttons - Visible on all sizes, responsive sizing */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button
            className="px-3 cursor-pointer py-2 md:px-6 md:py-3 md:w-[191px] md:h-[48px] bg-[#0222D7] text-white text-sm md:text-base rounded-[12px] flex items-center justify-center hover:bg-blue-800 transition-colors"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign Up for Free
          </button>

          <button
            className="px-3 py-2 cursor-pointer md:px-6 md:py-3 md:w-[191px] md:h-[48px] bg-[#0222D7] text-white text-sm md:text-base rounded-[12px] flex items-center justify-center hover:bg-blue-800 transition-colors"
            onClick={() => setIsLoginOpen(true)}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Render _Dialogs at the top level */}
      {isSignUpOpen && <SignUpDialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen} onSuccess={handleSignUpSuccess} caller="institution" />}
      
      {isLoginOpen && <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} caller="institution" />}
      {isOtpOpen && ( <OtpDialogBox open={isOtpOpen} setOpen={setIsOtpOpen} email={otpEmail} onVerificationSuccess={handleOtpVerified}/>)}
    </header>
  );
};

export default Header;