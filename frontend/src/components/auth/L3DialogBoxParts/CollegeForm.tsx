"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

interface CollegeFormDataProps {
  collegeType: string;
  collegeCategory: string;
  curriculumType: string;
  operationalDays: string[];
  otherActivities: string;
  hostelFacility: string;
  playground: string;
  busService: string;
}

interface CollegeFormProps {
  collegeFormData: CollegeFormDataProps;
  collegeFormErrors: Partial<Record<keyof CollegeFormDataProps | 'operationalDays', string>>;
  handleCollegeFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleCollegeRadioChangeWithValidation: (name: keyof CollegeFormDataProps, value: string) => void;
  handleCollegeOperationalDayToggle: (day: string) => void;
  operationalDaysOptions: string[];
  handleCollegeSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onPrevious?: () => void;
}

export default function CollegeForm({
  collegeFormData,
  collegeFormErrors,
  handleCollegeFieldChange,
  handleCollegeRadioChangeWithValidation,
  handleCollegeOperationalDayToggle,
  operationalDaysOptions,
  handleCollegeSubmit,
  isLoading,
  onPrevious,
}: CollegeFormProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your College.</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts that make students and parents choose you.
        </p>
      </div>

      <form onSubmit={handleCollegeSubmit} className="space-y-6">
        {/* Row 1: College Type and College Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="College type"
            name="collegeType"
            value={collegeFormData.collegeType}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "Junior College",
              "Senior Secondary",
              "Higher Secondary",
              "Intermediate",
              "Pre-University",
            ]}
            placeholder="Select college type"
            error={collegeFormErrors.collegeType}
            required
          />

          <InputField
            label="College category"
            name="collegeCategory"
            value={collegeFormData.collegeCategory}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "Government",
              "Private",
              "Semi-Government",
              "Aided",
              "Unaided",
            ]}
            placeholder="Select college category"
            error={collegeFormErrors.collegeCategory}
            required
          />
        </div>

        {/* Row 2: Curriculum Type and Operational Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Curriculum type"
            name="curriculumType"
            value={collegeFormData.curriculumType}
            onChange={handleCollegeFieldChange}
            isSelect
            options={[
              "State Board",
              "CBSE",
              "ICSE",
              "IB",
              "Cambridge",
              "Other",
            ]}
            placeholder="Select Curriculum type"
            error={collegeFormErrors.curriculumType}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
              Operational Day&apos;s <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {operationalDaysOptions.map((day: string) => (
                <Button
                  key={day}
                  type="button"
                  onClick={() => handleCollegeOperationalDayToggle(day)}
                  className={`h-[48px] px-3 rounded-[8px] border text-sm ${
                    collegeFormData.operationalDays.includes(day)
                      ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                      : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
            {collegeFormErrors.operationalDays && (
              <p className="text-red-500 text-xs mt-1">
                {collegeFormErrors.operationalDays}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Other Activities and Hostel Facility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Other activities"
            name="otherActivities"
            value={collegeFormData.otherActivities}
            onChange={handleCollegeFieldChange}
            placeholder="Enter activities"
            error={collegeFormErrors.otherActivities}
            required
          />

          <InputField
            label="Hostel facility ?"
            name="hostelFacility"
            value={collegeFormData.hostelFacility}
            onChange={(e) =>
              handleCollegeRadioChangeWithValidation(
                "hostelFacility",
                e.target.value
              )
            }
            isRadio
            options={["Yes", "No"]}
            error={collegeFormErrors.hostelFacility}
            required
          />
        </div>

        {/* Row 4: Playground and Bus Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Playground ?"
            name="playground"
            value={collegeFormData.playground}
            onChange={(e) =>
              handleCollegeRadioChangeWithValidation("playground", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={collegeFormErrors.playground}
            required
          />

          <InputField
            label="Bus service ?"
            name="busService"
            value={collegeFormData.busService}
            onChange={(e) =>
              handleCollegeRadioChangeWithValidation("busService", e.target.value)
            }
            isRadio
            options={["Yes", "No"]}
            error={collegeFormErrors.busService}
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
