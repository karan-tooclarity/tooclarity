"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";

type UGFormData = {
  ownershipType: string;
  collegeCategory: string;
  affiliationType: string;
  placementDrives: string;
  mockInterviews: string;
  resumeBuilding: string;
  linkedinOptimization: string;
  exclusiveJobPortal: string;
  library: string;
  hostelFacility: string;
  entranceExam: string;
  managementQuota: string;
  playground: string;
  busService: string;
};

type UGFormErrors = Partial<Record<keyof UGFormData, string>>;

interface UndergraduateFormProps {
  undergraduateFormData: UGFormData;
  undergraduateFormErrors: UGFormErrors;
  handleUndergraduateChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUndergraduateRadioChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleUndergraduateSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  onPrevious?: () => void;
}

export default function UndergraduateForm({
  undergraduateFormData,
  undergraduateFormErrors,
  handleUndergraduateChange,
  handleUndergraduateRadioChange,
  handleUndergraduateSubmit,
  isLoading,
  onPrevious,
}: UndergraduateFormProps) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold">Inside Your College.</h3>
        <p className="text-[#697282] text-sm">
          Share the key facts that students and parents choose you.
        </p>
      </div>

      <form onSubmit={handleUndergraduateSubmit} className="space-y-6">
        {/* Row 1: Ownership type and College category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Ownership type"
            name="ownershipType"
            value={undergraduateFormData.ownershipType}
            onChange={handleUndergraduateChange}
            isSelect
            options={[
              "Government",
              "Private",
              "Semi-Government",
              "Aided",
              "Unaided",
            ]}
            placeholder="Select ownership type"
            error={undergraduateFormErrors.ownershipType}
            required
          />

          <InputField
            label="College category"
            name="collegeCategory"
            value={undergraduateFormData.collegeCategory}
            onChange={handleUndergraduateChange}
            isSelect
            options={[
              "Engineering",
              "Medical",
              "Arts & Science",
              "Commerce",
              "Management",
              "Law",
              "Other",
            ]}
            placeholder="Select Category"
            error={undergraduateFormErrors.collegeCategory}
            required
          />
        </div>

        {/* Row 2: Affiliation type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Affiliation type"
            name="affiliationType"
            value={undergraduateFormData.affiliationType}
            onChange={handleUndergraduateChange}
            isSelect
            options={[
              "University",
              "Autonomous",
              "Affiliated",
              "Deemed University",
              "Other",
            ]}
            placeholder="Select Affiliation type"
            error={undergraduateFormErrors.affiliationType}
            required
          />
          <div></div>
        </div>

        {/* Placements Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-black">Placements</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Placement drives ?"
              name="placementDrives"
              value={undergraduateFormData.placementDrives}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.placementDrives}
              required
            />

            <InputField
              label="Mock interviews ?"
              name="mockInterviews"
              value={undergraduateFormData.mockInterviews}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.mockInterviews}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Resume building ?"
              name="resumeBuilding"
              value={undergraduateFormData.resumeBuilding}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.resumeBuilding}
              required
            />

            <InputField
              label="Linked-in optimization ?"
              name="linkedinOptimization"
              value={undergraduateFormData.linkedinOptimization}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.linkedinOptimization}
              required
            />
          </div>

          <InputField
            label="Access to exclusive job portal ?"
            name="exclusiveJobPortal"
            value={undergraduateFormData.exclusiveJobPortal}
            onChange={handleUndergraduateRadioChange}
            isRadio
            options={["Yes", "No"]}
            error={undergraduateFormErrors.exclusiveJobPortal}
            required
          />
        </div>

        {/* Other Questions Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-black">Other questions</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Library ?"
              name="library"
              value={undergraduateFormData.library}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.library}
              required
            />

            <InputField
              label="Hostel facility ?"
              name="hostelFacility"
              value={undergraduateFormData.hostelFacility}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.hostelFacility}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Entrance exam ?"
              name="entranceExam"
              value={undergraduateFormData.entranceExam}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.entranceExam}
              required
            />

            <InputField
              label="Management Quota ?"
              name="managementQuota"
              value={undergraduateFormData.managementQuota}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.managementQuota}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Playground ?"
              name="playground"
              value={undergraduateFormData.playground}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.playground}
              required
            />

            <InputField
              label="Bus service ?"
              name="busService"
              value={undergraduateFormData.busService}
              onChange={handleUndergraduateRadioChange}
              isRadio
              options={["Yes", "No"]}
              error={undergraduateFormErrors.busService}
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
