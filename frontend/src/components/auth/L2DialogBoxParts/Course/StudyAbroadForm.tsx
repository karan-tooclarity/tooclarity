"use client";

import InputField from "@/components/ui/InputField";
import { Upload } from "lucide-react";
import type { Course } from "../../L2DialogBox";
import { ChangeEvent } from "react";
import Image from "next/image";

interface StudyAbroadFormProps {
  currentCourse: Course;
  handleCourseChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "brochure" | "businessProof" | "panAadhaar"
  ) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  courses: Course[];
  selectedCourseId: number;
  courseErrors: Record<string, string>;
}

const countries = [
  "Select Country",
  "USA",
  "Canada",
  "UK",
  "Australia",
  "New Zealand",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Finland",
  "Austria",
  "Ireland",
  "Poland",
  "Lithuania",
  "Japan",
  "Singapore",
  "Malaysia",
  "UAE",
  "India",
];

const academicOfferings = [
  "Select Academic type",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Diploma",
  "Certificate",
  "Professional Course",
];

export default function StudyAbroadForm({
  currentCourse,
  handleCourseChange,
  handleFileChange,
  // setCourses,
  // courses,
  // selectedCourseId,
  courseErrors = {},
}: StudyAbroadFormProps) {
  return (
    <div className="space-y-6">
      {/* Basic Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Consultancy name"
          name="consultancyName"
          value={currentCourse.consultancyName || ""}
          onChange={handleCourseChange}
          placeholder="Enter Consultancy name"
          error={courseErrors.consultancyName}
          required
        />

        <InputField
          label="Overall student admissions achieved through our consultancy till now"
          name="studentAdmissions"
          value={currentCourse.studentAdmissions || ""}
          onChange={handleCourseChange}
          placeholder="Enter Students Count"
          type="number"
          error={courseErrors.studentAdmissions}
          required
        />

        <InputField
          label="Countries you offer"
          name="countriesOffered"
          value={currentCourse.countriesOffered || ""}
          onChange={handleCourseChange}
          isSelect
          options={countries}
          placeholder="Select Country"
          error={courseErrors.countriesOffered}
          required
        />

        <InputField
          label="Academic Offerings"
          name="academicOfferings"
          value={currentCourse.academicOfferings || ""}
          onChange={handleCourseChange}
          isSelect
          options={academicOfferings}
          placeholder="Select Academic type"
          error={courseErrors.academicOfferings}
          required
        />
      </div>

      {/* Image and Brochure Upload */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">
            Add Image <span className="text-red-500">*</span>
          </label>
          <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
            {currentCourse.imagePreviewUrl || currentCourse.imageUrl ? (
              <Image
                width={100}
                height={100}
                src={currentCourse.imagePreviewUrl || currentCourse.imageUrl}
                alt="Course Image Preview"
                className="w-[100px] h-[100px] object-cover rounded-md"
              />
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Upload Course Image (jpg / jpeg)
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, "image")}
            />
          </label>
          {courseErrors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">{courseErrors.imageUrl}</p>
          )}
        </div>

        {/* Brochure Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[16px]">
            Add Brochure <span className="text-red-500">*</span>
          </label>
          <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
            {currentCourse.brochurePreviewUrl || currentCourse.brochureUrl ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
                <span className="text-sm text-gray-500 truncate">
                  {currentCourse.brochure instanceof File
                    ? currentCourse.brochure.name
                    : "Brochure uploaded"}
                </span>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Upload Brochure Course (pdf)
                </span>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, "brochure")}
            />
          </label>
          {courseErrors.brochureUrl && (
            <p className="text-red-500 text-sm mt-1">{courseErrors.brochureUrl}</p>
          )}
        </div>
      </div>

      {/* Legal Verification Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-[18px]">Legal Verification</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Business Proof Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px]">
              Upload Business Proof (jpg / jpeg)
            </label>
            <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
              {currentCourse.businessProofPreviewUrl || currentCourse.businessProofUrl ? (
                <Image
                  width={100}
                  height={100}
                  src={currentCourse.businessProofPreviewUrl || currentCourse.businessProofUrl}
                  alt="Business Proof Preview"
                  className="w-[100px] h-[100px] object-cover rounded-md"
                />
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Upload Business Proof (jpg / jpeg)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, "businessProof")}
              />
            </label>
            {courseErrors.businessProofUrl && (
              <p className="text-red-500 text-sm mt-1">{courseErrors.businessProofUrl}</p>
            )}
          </div>

          {/* PAN/Aadhaar Upload */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[16px]">
              Upload PAN or Aadhar of authority person (pdf)
            </label>
            <label className="relative w-full h-[180px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors overflow-hidden">
              {currentCourse.panAadhaarPreviewUrl || currentCourse.panAadhaarUrl ? (
                <div className="flex flex-col items-center justify-center gap-2 p-4 w-full h-full">
                  <span className="text-sm text-gray-500 truncate">
                    {currentCourse.panAadhaar instanceof File
                      ? currentCourse.panAadhaar.name
                      : "Document uploaded"}
                  </span>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Upload PAN or Aadhar of authority person (pdf)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileChange(e, "panAadhaar")}
              />
            </label>
            {courseErrors.panAadhaarUrl && (
              <p className="text-red-500 text-sm mt-1">{courseErrors.panAadhaarUrl}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
