"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

type SchoolFormData = {
  schoolType: string;
  schoolCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
};

type SchoolFormErrors = Partial<Record<keyof SchoolFormData, string>> & {
  operationalDays?: string;
};

interface SchoolFormProps {
  schoolFormData: SchoolFormData;
  schoolFormErrors: SchoolFormErrors;
  handleSchoolFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSchoolRadioChangeWithValidation: (name: keyof SchoolFormData, value: string) => void;
  handleSchoolOperationalDayToggle: (day: string) => void;
  operationalDaysOptions: string[];
  handleSchoolSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  onPrevious?: () => void;
}

export default function SchoolForm({
  schoolFormData,
  schoolFormErrors,
  handleSchoolFieldChange,
  handleSchoolRadioChangeWithValidation,
  handleSchoolOperationalDayToggle,
  operationalDaysOptions,
  handleSchoolSubmit,
  isLoading,
  onPrevious,
}: SchoolFormProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your School.</h3>
        <p className="text-[#697282] text-sm">
          Fill in this checklist with the important details students and parents look for.
        </p>
      </div>

      <form onSubmit={handleSchoolSubmit} className="space-y-6">
        {/* Row 1: School Type and School Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="School type"
            name="schoolType"
            value={schoolFormData.schoolType}
            onChange={handleSchoolFieldChange}
            isSelect
            options={["Co-ed", "Boys Only", "Girls Only"]}
            placeholder="Select school type"
            error={schoolFormErrors.schoolType}
            required
          />

          <InputField
            label="School category"
            name="schoolCategory"
            value={schoolFormData.schoolCategory}
            onChange={handleSchoolFieldChange}
            isSelect
            options={[
              "Public",
              "Private",
              "Charter",
              "International",
            ]}
            placeholder="Select school Category"
            error={schoolFormErrors.schoolCategory}
            required
          />
        </div>

        {/* Row 2: Curriculum Type and Operational Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Curriculum type"
            name="curriculumType"
            value={schoolFormData.curriculumType}
            onChange={handleSchoolFieldChange}
            isSelect
            options={["State Board", "CBSE", "ICSE", "IB", "IGCSE"]}
            placeholder="Select Curriculum type"
            error={schoolFormErrors.curriculumType}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
              Operational Days
            </label>
            <div className="grid grid-cols-6 gap-2">
              {operationalDaysOptions.map((day: string) => (
                <Button
                  key={day}
                  type="button"
                  onClick={() => handleSchoolOperationalDayToggle(day)}
                  className={`h-[48px] px-3 rounded-[8px] border text-sm ${
                    schoolFormData.operationalDays.includes(day)
                      ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                      : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
            {schoolFormErrors.operationalDays && (
              <p className="text-red-500 text-sm">{schoolFormErrors.operationalDays}</p>
            )}
          </div>
        </div>

        {/* Row 3: Other Activities and Hostel Facility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Other activities"
            name="otherActivities"
            value={schoolFormData.otherActivities}
            onChange={handleSchoolFieldChange}
            placeholder="Enter activities"
            isTextarea
            rows={2}
            error={schoolFormErrors.otherActivities}
            required
          />

          <InputField
            label="Hostel facility ?"
            name="hostelFacility"
            value={schoolFormData.hostelFacility}
            onChange={(e) =>
              handleSchoolRadioChangeWithValidation("hostelFacility", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={schoolFormErrors.hostelFacility}
            required
          />
        </div>

        {/* Row 4: Playground and Bus Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Playground ?"
            name="playground"
            value={schoolFormData.playground}
            onChange={(e) =>
              handleSchoolRadioChangeWithValidation("playground", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={schoolFormErrors.playground}
            required
          />

          <InputField
            label="Bus service ?"
            name="busService"
            value={schoolFormData.busService}
            onChange={(e) =>
              handleSchoolRadioChangeWithValidation("busService", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={schoolFormErrors.busService}
            required
          />
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
