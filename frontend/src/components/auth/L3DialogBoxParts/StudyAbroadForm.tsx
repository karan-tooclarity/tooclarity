"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

export default function StudyAbroadForm({
  formData,
  formErrors,
  onRadioChange,
  onSubmit,
  isLoading,
  onPrevious,
}: any) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your institute.</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts that students and parents choose you.
        </p>
      </div>

      <div className="space-y-4 mt-4">
        <h4 className="text-xl font-semibold">Placements</h4>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Application Assistance"
            name="applicationAssistance"
            value={formData.applicationAssistance}
            onChange={(e: any) => onRadioChange("applicationAssistance", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.applicationAssistance}
            required
          />
          <InputField
            label="Visa Processing Support"
            name="visaProcessingSupport"
            value={formData.visaProcessingSupport}
            onChange={(e: any) => onRadioChange("visaProcessingSupport", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.visaProcessingSupport}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Test Operation (IELTS,TOEFL,GRE,GMAT,SAT)"
            name="testOperation"
            value={formData.testOperation}
            onChange={(e: any) => onRadioChange("testOperation", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.testOperation}
            required
          />
          <InputField
            label="Pre-departure orientation"
            name="preDepartureOrientation"
            value={formData.preDepartureOrientation}
            onChange={(e: any) => onRadioChange("preDepartureOrientation", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.preDepartureOrientation}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Accommodation assistance"
            name="accommodationAssistance"
            value={formData.accommodationAssistance}
            onChange={(e: any) => onRadioChange("accommodationAssistance", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.accommodationAssistance}
            required
          />
          <InputField
            label="Education loans/Financial aid guidance"
            name="educationLoans"
            value={formData.educationLoans}
            onChange={(e: any) => onRadioChange("educationLoans", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.educationLoans}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Post-arrival support"
            name="postArrivalSupport"
            value={formData.postArrivalSupport}
            onChange={(e: any) => onRadioChange("postArrivalSupport", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.postArrivalSupport}
            required
          />
          <div></div>
        </div>

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



