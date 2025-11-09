"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InputField from "@/components/ui/InputField";
import { Plus } from "lucide-react";

// ✅ 1. Define the shape for a country option
interface CountryOption {
  code: string;
  dialCode: string;
  flag: string;
}

// ✅ 2. Update the Branch interface to include the country code
interface Branch {
  id: number;
  branchName: string;
  branchAddress: string;
  contactInfo: string;
  contactCountryCode?: string; // Add this field
  locationUrl: string;
}

interface BranchFormProps {
  branches: Branch[];
  selectedBranchId: number;
  handleBranchChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleBranchSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handlePreviousClick?: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
}

export default function BranchForm({
  branches,
  selectedBranchId,
  handleBranchChange,
  handleBranchSubmit,
  handlePreviousClick,
  isLoading,
  errors = {},
}: BranchFormProps) {

  // ✅ 3. Add the countries data and state for the dropdown
  const countries: CountryOption[] = [
    { code: "IN", dialCode: "+91", flag: "https://flagcdn.com/w20/in.png" },
    { code: "US", dialCode: "+1", flag: "https://flagcdn.com/w20/us.png" },
    { code: "GB", dialCode: "+44", flag: "https://flagcdn.com/w20/gb.png" },
    { code: "AU", dialCode: "+61", flag: "https://flagcdn.com/w20/au.png" },
    { code: "CA", dialCode: "+1", flag: "https://flagcdn.com/w20/ca.png" },
    { code: "AE", dialCode: "+971", flag: "https://flagcdn.com/w20/ae.png" },
    { code: "SG", dialCode: "+65", flag: "https://flagcdn.com/w20/sg.png" },
  ];

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentBranch =
  branches?.find((b) => b.id === selectedBranchId) ||
  branches?.[0] || {
    id: 0,
    branchName: "",
    branchAddress: "",
    contactInfo: "",
    locationUrl: "",
  };


  // ✅ 4. Create a handler to manage country selection
  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false); // Close the dropdown

    // We can simulate a change event to update the parent component's state
    // This is a clean way to integrate without changing the parent's logic
    const syntheticEvent = {
      target: {
        name: "contactCountryCode",
        value: country.dialCode,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleBranchChange(syntheticEvent);
  };

  return (
    <form onSubmit={handleBranchSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          label="Branch Name"
          name="branchName"
          value={currentBranch.branchName}
          onChange={handleBranchChange}
          placeholder="Enter Branch name"
          error={errors.branchName}
          required
        />
        
        {/* ✅ 5. Replace the old InputField with the detailed contact info block */}
        <div className="flex flex-col gap-3 w-full">
            <label
                htmlFor="contactInfo"
                className="text-[#060B13] font-montserrat font-medium text-[16px] sm:text-[18px] leading-[22px]"
            >
                Contact Info<span className="text-red-500 ml-1">*</span>
            </label>
            <div className={`flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-white border rounded-[12px] ${errors.contactInfo ? 'border-red-500' : 'border-[#DADADD]'}`}>
                {/* <img src="/call log icon.png" alt="phone icon" className="w-[20px] h-[20px] object-cover" /> */}
                <Image src="/call log icon.png" alt="phone icon" width={20} height={20} className="w-[20px] h-[20px] object-cover" />

                {/* Flag + Dropdown */}
                <div className="relative flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {/* <img src={selectedCountry.flag} alt={selectedCountry.code} className="w-[20px] h-[14px] object-cover rounded-sm" /> */}
                    <Image src={selectedCountry.flag} alt={selectedCountry.code} width={20} height={14} className="w-[20px] h-[14px] object-cover rounded-sm" />
                    <span className="text-[#060B13]">{selectedCountry.dialCode}</span>
                    <svg className={`w-4 h-4 text-[#060B13] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>

                    {isDropdownOpen && (
                        <ul className="absolute top-full left-0 mt-1 w-[80px] max-h-40 overflow-y-auto bg-white border border-[#DADADD] rounded-md z-50">
                            {countries.map((country) => (
                                <li key={country.code} className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-center" onClick={() => handleCountrySelect(country)}>
                                    {country.dialCode}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Phone Input */}
                <input
                    id="contactInfo"
                    name="contactInfo"
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="00000 00000"
                    value={currentBranch.contactInfo}
                    onChange={handleBranchChange}
                      className="flex-1 text-[#060B13] font-montserrat text-[16px] leading-[20px] bg-transparent focus:outline-none"
                    // className="flex-1 text-[#060B13] font-montserrat text-[16px] leading-[20px] bg-transparent focus:outline-none"
                />
            </div>
            {errors.contactInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
            )}
        </div>

        <InputField
          label="Branch address"
          name="branchAddress"
          value={currentBranch.branchAddress}
          onChange={handleBranchChange}
          placeholder="Enter address"
          error={errors.branchAddress}
          required
        />
        <InputField
          label="Location URL"
          name="locationUrl"
          value={currentBranch.locationUrl}
          onChange={handleBranchChange}
          placeholder="Paste the URL"
          error={errors.locationUrl}
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-center pt-4 gap-4 w-full">
        {handlePreviousClick && (
            <button
              type="button"
              onClick={handlePreviousClick}
              className="w-full sm:w-[314px] h-[48px] border border-[#697282] text-[#697282] rounded-[12px] font-semibold text-[16px] sm:text-[18px] leading-[22px] flex items-center justify-center shadow-inner"
            >
              Previous
            </button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:max-w-[350px] h-[48px] rounded-[12px] font-semibold transition-colors ${
            isLoading
              ? "opacity-50 cursor-not-allowed bg-blue-600"
              : "bg-[#6B7280] hover:bg-[#6B7280]/90"
          } text-white text-[16px] sm:text-[18px]`}
        >
          <Plus size={16} />
          {isLoading ? "Saving..." : "Save & Add Course"}
        </Button>
      </div>
    </form>
  );
}