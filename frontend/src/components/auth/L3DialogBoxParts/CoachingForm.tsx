"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

interface CoachingFormDataProps {
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  certification: string;
}

interface CoachingFormProps {
  coachingFormData: CoachingFormDataProps;
  coachingFormErrors: Partial<Record<keyof CoachingFormDataProps, string>>;
  handleCoachingFieldChange: (name: keyof CoachingFormDataProps, value: string) => void;
  handleCoachingSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onPrevious?: () => void;
}

export default function CoachingForm({
  coachingFormData,
  coachingFormErrors,
  handleCoachingFieldChange,
  handleCoachingSubmit,
  isLoading,
  onPrevious,
}: CoachingFormProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your institute.</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts that students and parents choose you.
        </p>
      </div>

      <form onSubmit={handleCoachingSubmit} className="space-y-6">
        {/* Placements Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-black">Placements</h4>

          {/* Row 1: Placement drives and Mock interviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Placement drives ?"
              name="placementDrives"
              value={coachingFormData.placementDrives}
              onChange={(e) =>
                handleCoachingFieldChange("placementDrives", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.placementDrives}
              required
            />

            <InputField
              label="Mock interviews ?"
              name="mockInterviews"
              value={coachingFormData.mockInterviews}
              onChange={(e) =>
                handleCoachingFieldChange("mockInterviews", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.mockInterviews}
              required
            />
          </div>

          {/* Row 2: Resume building and LinkedIn optimization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Resume building ?"
              name="resumeBuilding"
              value={coachingFormData.resumeBuilding}
              onChange={(e) =>
                handleCoachingFieldChange("resumeBuilding", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.resumeBuilding}
              required
            />

            <InputField
              label="LinkedIn optimization ?"
              name="linkedinOptimization"
              value={coachingFormData.linkedinOptimization}
              onChange={(e) =>
                handleCoachingFieldChange("linkedinOptimization", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.linkedinOptimization}
              required
            />
          </div>

          {/* Row 3: Access to exclusive job portal and Certification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Access to exclusive job portal ?"
              name="exclusiveJobPortal"
              value={coachingFormData.exclusiveJobPortal}
              onChange={(e) =>
                handleCoachingFieldChange("exclusiveJobPortal", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.exclusiveJobPortal}
              required
            />

            <InputField
              label="Certification ?"
              name="certification"
              value={coachingFormData.certification}
              onChange={(e) =>
                handleCoachingFieldChange("certification", e.target.value)
              }
              isRadio
              options={["Yes", "No"]}
              error={coachingFormErrors.certification}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center pt-4">
          <div className="flex flex-row items-center justify-center gap-10 w-full max-w-[668px]">
            <button
              type="button"
              onClick={() => onPrevious?.()}
              className="w-[314px] h-[48px] border border-[#697282] text-[#697282] rounded-[12px] font-semibold text-[18px] leading-[22px] flex items-center justify-center shadow-inner"
            >
              Previous
            </button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-[314px] h-[48px] bg-[#697282] text-[#F5F6F9] rounded-[12px] font-semibold text-[18px] leading-[22px] flex items-center justify-center hover:bg-[#5b626f] transition-colors"
            >
              {isLoading ? "Saving..." : "Save & Next"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
