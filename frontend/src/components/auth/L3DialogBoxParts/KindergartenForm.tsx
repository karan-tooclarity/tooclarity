"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import { Clock } from "lucide-react";

export default function KindergartenForm({
  formData,
  formErrors,
  handleChange,
  handleRadioChange,
  handleOperationalDayChange,
  operationalDaysOptions,
  handleSubmit,
  isLoading,
  onPrevious,
}: {
  formData: Record<string, unknown>;
  formErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleOperationalDayChange: (day: string) => void;
  operationalDaysOptions: string[];
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onPrevious: () => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your Kindergarten.</h3>
        <p className="text-[#697282] text-sm">
          Fill in this checklist with the important details parents look for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: School Type and Curriculum Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="School type"
            name="schoolType"
            value={formData.schoolType as string}
            onChange={handleChange}
            isSelect
            options={[
              "Public",
              "Private (For-profit)",
              "Private (Non-profit)",
              "International",
              "Home - based",
            ]}
            placeholder="Select school type"
            error={formErrors.schoolType}
            required
          />

          <InputField
            label="Curriculum type"
            name="curriculumType"
            value={formData.curriculumType as string}
            onChange={handleChange}
            placeholder="Enter Curriculum type"
            error={formErrors.curriculumType}
            required
          />
        </div>

        {/* Row 2: Operational Times and Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
              Operational Times <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label=""
                name="openingTime"
                value={formData.openingTime as string}
                onChange={handleChange}
                placeholder="Opening time"
                className="max-w-none"
                icon={<Clock size={18} className="text-[#697282]" />}
                error={formErrors.openingTime}
              />
              <InputField
                label=""
                name="closingTime"
                value={formData.closingTime as string}
                onChange={handleChange}
                placeholder="Closing time"
                className="max-w-none"
                icon={<Clock size={18} className="text-[#697282]" />}
                error={formErrors.closingTime}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-[Montserrat] font-medium text-[16px] md:text-[18px] text-black">
              Operational Days <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {operationalDaysOptions.map((day: string) => (
                <Button
                  key={day}
                  type="button"
                  onClick={() => handleOperationalDayChange(day)}
                  className={`h-[48px] px-3 rounded-[8px] border text-sm ${
                    ((formData.operationalDays as string[]) || []).includes(day)
                      ? "bg-[#0222D7] border-[#0222D7] text-white hover:!bg-[#0222D7]"
                      : "bg-[#F5F6F9] border-[#DADADD] text-[#697282] hover:!bg-[#F5F6F9] hover:!text-[#697282]"
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
            {formErrors.operationalDays && (
              <p className="text-red-500 text-sm">{formErrors.operationalDays}</p>
            )}
          </div>
        </div>

        {/* Row 3: Radio Button Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Extended care ?"
            name="extendedCare"
            value={formData.extendedCare as string}
            onChange={(e) => handleRadioChange("extendedCare", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.extendedCare}
            required
          />

          <InputField
            label="Meals Provided?"
            name="mealsProvided"
            value={formData.mealsProvided as string}
            onChange={(e) => handleRadioChange("mealsProvided", e.target.value)}
            isRadio
            options={["Yes", "No"]}
            error={formErrors.mealsProvided}
            required
          />
        </div>

        <InputField
          label="Outdoor Play area?"
          name="outdoorPlayArea"
          value={formData.outdoorPlayArea as string}
          onChange={(e) => handleRadioChange("outdoorPlayArea", e.target.value)}
          isRadio
          options={["Yes", "No"]}
          error={formErrors.outdoorPlayArea}
          required
        />

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
