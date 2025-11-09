"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StudentOtpSuccessProps {
  title?: string;
  description?: string;
  continueLabel?: string;
  onContinue?: () => void;
  fullScreen?: boolean;
}

const StudentOtpSuccess: React.FC<StudentOtpSuccessProps> = ({
  title = "OTP Verified Successfully",
  description = "Your mobile number has been verified successfully.",
  continueLabel = "Continue",
  onContinue,
  fullScreen = true,
}) => {
  const router = useRouter(); 

  const handleContinue = () => {
    if (onContinue) {
      onContinue(); 
    } else {
      router.push("/student/onboarding");
    }
  };

  const content = (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center text-center md:max-w-lg lg:max-w-xl">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <div className="relative flex items-center justify-center">
          <div className="flex size-48 items-center justify-center rounded-full bg-[#4CD964]/60 shadow-inner md:size-56 lg:size-64">
            <div className="flex size-36 items-center justify-center rounded-full bg-[#34C759]/80 md:size-44 lg:size-52">
              <div className="flex size-20 items-center justify-center rounded-full bg-white md:size-24 lg:size-28">
                <Check
                  className="size-10 text-[#24B24A] md:size-12"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="px-3 text-sm text-gray-700 sm:text-base md:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 w-full">
        <Button
          onClick={handleContinue}
          className="w-full rounded-[18px] bg-gradient-to-r from-[#0048FF] to-[#0024A3] py-4 text-base font-semibold text-white shadow-[0_8px_16px_rgba(7,66,0,0.35)] transition hover:brightness-105 md:py-5 md:text-lg"
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <section className="flex min-h-screen flex-col justify-between bg-[#AEE6A6] px-5 py-10 md:px-8 lg:px-12">
        {content}
      </section>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
};

export default StudentOtpSuccess;
