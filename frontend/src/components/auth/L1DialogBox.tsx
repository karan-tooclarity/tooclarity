"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { validateField, validateForm } from "@/lib/validations/validateField";
import {
  addInstitutionToDB,
  getAllInstitutionsFromDB,
  updateInstitutionInDB,
} from "@/lib/localDb";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/levels_dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import InputField from "@/components/ui/InputField";
// import { institutionAPI, clearInstitutionData } from "@/lib/api";
import { L1Schema } from "@/lib/validations/L1Schema";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { uploadToS3 } from "@/lib/awsUpload";

interface FormData {
  instituteType: string;
  instituteName: string;
  approvedBy: string;
  establishmentDate: string;
  contactInfo: string;
  // contactCountryCode: string;              // 👈 add this
  additionalContactInfo: string;
  // additionalContactCountryCode: string;   // 👈 add this
  headquartersAddress: string;
  state: string;
  pincode: string;
  locationURL: string;
  logo?: File | null;
  logoUrl?: string;
  logoPreviewUrl?: string;
}

interface Errors {
  [key: string]: string | undefined;
}

interface L1DialogBoxProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onInstituteTypeChange?: (type: string) => void;
  onSuccess?: () => void;
  schema?: typeof L1Schema; // 👈 dynamic schema
}

export default function L1DialogBox({
  trigger,
  open,
  onOpenChange,
  onInstituteTypeChange,
  onSuccess,
}: L1DialogBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    instituteType: "",
    instituteName: "",
    approvedBy: "",
    establishmentDate: "",
    contactInfo: "",
    additionalContactInfo: "",
    headquartersAddress: "",
    state: "",
    pincode: "",
    locationURL: "",
    logo: null,
    logoUrl: "",
    logoPreviewUrl: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_LOG_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  // Handle controlled open state
  const dialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const activeSchema = L1Schema;

  // Prefill from IndexedDB if data exists; otherwise keep blanks
  useEffect(() => {
    if (!dialogOpen) return;

    let isMounted = true;
    (async () => {
      try {
        const institutions = await getAllInstitutionsFromDB();
        if (!isMounted) return;

        if (institutions && institutions.length > 0) {
          const latest = institutions.sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
          )[0];
          setFormData({
            instituteType: latest.instituteType || "",
            instituteName: latest.instituteName || "",
            approvedBy: latest.approvedBy || "",
            establishmentDate: latest.establishmentDate || "",
            contactInfo: latest.contactInfo || "",
            additionalContactInfo: latest.additionalContactInfo || "",
            headquartersAddress: latest.headquartersAddress || "",
            state: latest.state || "",
            pincode: latest.pincode || "",
            locationURL: latest.locationURL || "",
            logoUrl: latest.logoUrl || "",
            logoPreviewUrl: latest.logoPreviewUrl || "",
          });
        } else {
          // ensure blank state
          setFormData({
            instituteType: "",
            instituteName: "",
            approvedBy: "",
            establishmentDate: "",
            contactInfo: "",
            additionalContactInfo: "",
            headquartersAddress: "",
            state: "",
            pincode: "",
            locationURL: "",
            logo: null,
            logoUrl: "",
            logoPreviewUrl: "",
          });
        }
      } catch (err) {
        console.error("Failed to load institutions from IndexedDB", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [dialogOpen]);
  // L1DialogBox.tsx

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // 1. Create an updated copy of the form data with the new value
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    // 2. Update the component's state to reflect the change in the UI
    setFormData(updatedFormData);

    // 3. Validate the *entire updated form object* to give Joi the full context
    const { error } = L1Schema.validate(updatedFormData, { abortEarly: false });

    // 4. Find the specific error message only for the field that was just changed
    const fieldError = error?.details.find((detail) => detail.path[0] === name);

    // 5. Update the errors state for the current field
    //    - If an error is found for this field, set it.
    //    - If no error is found for this field (meaning it's now valid), clear it.
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError ? fieldError.message : undefined,
    }));

    // Also, handle the side-effect for onInstituteTypeChange
    if (name === "instituteType" && onInstituteTypeChange) {
      onInstituteTypeChange(value);
    }
  };
  interface CountryOption {
    code: string;
    dialCode: string;
    flag: string;
  }

  const countries: CountryOption[] = [
    { code: "IN", dialCode: "+91", flag: "https://flagcdn.com/w20/in.png" },
    { code: "US", dialCode: "+1", flag: "https://flagcdn.com/w20/us.png" },
    { code: "GB", dialCode: "+44", flag: "https://flagcdn.com/w20/gb.png" },
    { code: "AU", dialCode: "+61", flag: "https://flagcdn.com/w20/au.png" },
    { code: "CA", dialCode: "+1", flag: "https://flagcdn.com/w20/ca.png" },
    { code: "AE", dialCode: "+971", flag: "https://flagcdn.com/w20/ae.png" },
    { code: "SG", dialCode: "+65", flag: "https://flagcdn.com/w20/sg.png" },
  ];

  const [selectedCountryContact, setSelectedCountryContact] =
    useState<CountryOption>(countries[0]);
  const [selectedCountryAdditional, setSelectedCountryAdditional] =
    useState<CountryOption>(countries[0]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCountrySelect = (
    field: "contact" | "additional",
    country: CountryOption
  ) => {
    if (field === "contact") {
      setSelectedCountryContact(country);
      setFormData((prev) => ({
        ...prev,
        contactCountryCode: country.dialCode,
      }));
    } else {
      setSelectedCountryAdditional(country);
      setFormData((prev) => ({
        ...prev,
        additionalContactCountryCode: country.dialCode,
      }));
    }
  };
  // This effect runs whenever the institute type changes
  // L1DialogBox.tsx

  // L1DialogBox.tsx

  useEffect(() => {
    if (formData.instituteType === "Study Halls" || formData.instituteType === "Study Abroad") {
      setFormData((prev) => ({
        ...prev,
        approvedBy: "",
        establishmentDate: "",
        logo: null,
        logoUrl: "",
        logoPreviewUrl: "",
      }));

      setErrors((prev) => ({
        ...prev,
        approvedBy: undefined,
        establishmentDate: undefined,
        logo: undefined,
        logoUrl: undefined,
      }));
    }
  }, [formData.instituteType]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFormData((prev) => ({
        ...prev,
        logo: null,
        logoPreviewUrl: "",
      }));
      setErrors((prev) => ({ ...prev, logo: undefined }));
      return;
    }

    // ✅ Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      setFormData((prev) => ({
        ...prev,
        logo: null,
        logoPreviewUrl: "",
      }));
      setErrors((prev) => ({
        ...prev,
        logo: "Logo must be a valid image file (.jpg, .jpeg, .png).",
      }));
      return;
    }

    // ✅ Validate file size
    if (selectedFile.size > MAX_LOG_FILE_SIZE) {
      setFormData((prev) => ({
        ...prev,
        logo: null,
        logoPreviewUrl: "",
      }));
      setErrors((prev) => ({
        ...prev,
        logo: "File size must be 1 MB or less.",
      }));
      return;
    }

    // ✅ Release previous blob URL to avoid memory leaks
    if (formData.logoPreviewUrl) {
      URL.revokeObjectURL(formData.logoPreviewUrl);
    }

    // ✅ Store file for upload + temporary preview URL
    setFormData((prev) => ({
      ...prev,
      logo: selectedFile,
      logoPreviewUrl: URL.createObjectURL(selectedFile),
    }));

    setErrors((prev) => ({ ...prev, logo: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setIsLoading(true);

    try {
      let logoUrl = formData.logoUrl;

      // ✅ Get the most recently saved institution (for comparison)
      const institutions = await getAllInstitutionsFromDB();
      const latest =
        institutions && institutions.length > 0
          ? institutions.sort(
              (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
            )[0]
          : null;

      const latestLogoUrl = latest?.logoUrl || "";
      const latestLogoPreview = latest?.logoPreviewUrl || "";

      console.log("🔍 Latest saved logo:", latestLogoUrl);
      console.log("🔍 Latest saved preview:", latestLogoPreview);
      console.log("🆕 Current preview:", formData.logoPreviewUrl);

      // ✅ 1) Check if logo changed before uploading
      const isLogoChanged =
        formData.logo &&
        formData.logo instanceof File &&
        formData.logoPreviewUrl !== latestLogoPreview;

      if (isLogoChanged && formData.logo instanceof File) {
        try {
          console.log("⬆️ Uploading new logo to AWS S3...");

          // 🧠 Support both single & multiple files
          const uploadResult = await uploadToS3(formData.logo);

          if (Array.isArray(uploadResult)) {
            const first = uploadResult[0];
            if (!first?.success)
              throw new Error(first?.error || "Upload failed");
            logoUrl = first.fileUrl || logoUrl;
          } else {
            if (!uploadResult.success)
              throw new Error(uploadResult.error || "Upload failed");
            logoUrl = uploadResult.fileUrl || logoUrl;
          }

          console.log("✅ Logo uploaded successfully:", logoUrl);
        } catch (uploadError) {
          console.error("❌ AWS upload failed:", uploadError);
          setErrors((prev) => ({
            ...prev,
            logo: "Failed to upload logo. Try again.",
          }));
          setIsLoading(false);
          return;
        }
      } else {
        console.log("⚡ Skipping logo upload — same preview detected.");
      }

      // ✅ 2) Prepare data for validation and saving
      const dataToValidate = { ...formData, logoUrl };

      // ✅ 3) Validate after upload
      const { error } = activeSchema.validate(dataToValidate, {
        abortEarly: false,
      });
      if (error) {
        const validationErrors: Errors = {};
        error.details.forEach((err) => {
          const fieldName = err.path[0] as string;
          validationErrors[fieldName] = err.message.replace(
            '"value"',
            fieldName
          );
        });
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      setErrors({});

      // ✅ 4) Normalize data before saving
      const normalize = (x: any) => ({
        instituteType: x.instituteType || "",
        instituteName: x.instituteName || "",
        approvedBy: x.approvedBy || "",
        establishmentDate: x.establishmentDate || "",
        contactInfo: x.contactInfo || "",
        additionalContactInfo: x.additionalContactInfo || "",
        headquartersAddress: x.headquartersAddress || "",
        state: x.state || "",
        pincode: x.pincode || "",
        locationURL: x.locationURL || "",
        logoUrl: x.logoUrl || "",
        logoPreviewUrl: x.logoPreviewUrl || "",
      });

      const current = normalize(dataToValidate);
      let effectiveId: number | null = null;

      if (latest) {
        const latestNormalized = normalize(latest);
        const isSame =
          JSON.stringify(latestNormalized) === JSON.stringify(current);

        if (isSame) {
          console.log("✅ No changes detected. Skipping DB update.");
          effectiveId = latest.id || null;
        } else {
          console.log("🔄 Updating institution in IndexedDB...");
          await updateInstitutionInDB({
            ...(latest as any),
            ...current,
            id: latest.id,
          });
          effectiveId = latest.id || null;
        }
      } else {
        console.log("🆕 Adding new institution to IndexedDB...");
        const id = await addInstitutionToDB(current);
        effectiveId = id;
        console.log("✅ Institution saved locally with id:", id);
      }

      // ✅ 5) Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("institutionType", current.instituteType);
        if (effectiveId !== null)
          localStorage.setItem("institutionId", String(effectiveId));
        if (current.logoUrl)
          localStorage.setItem("institutionLogFileName", current.logoUrl);
        else localStorage.removeItem("institutionLogFileName");
      }

      setDialogOpen(false);
      setSubmitted(false);
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error(
        "❌ Error saving/updating institution in IndexedDB:",
        error
      );
      setErrors((prev) => ({
        ...prev,
        logo: "Failed to save institution. Try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const [isDropdownOpenAdditional, setIsDropdownOpenAdditional] =
    useState(false);

  const isBaseFormValid = !activeSchema.validate(formData, {
    abortEarly: false,
  }).error;

  const isLogoValid =
    formData.instituteType === "Study Abroad" ||
    (!errors.logFile && (formData.logo === null || formData.logo instanceof File));

  const isFormComplete = isBaseFormValid && isLogoValid;

  const countryFlags = {
    "+91": "/India-flag.png",
    "+1": "/US-flag.png",
    "+44": "/UK-flag.png",
    "+61": "/Australia-flag.png",
    // add more as needed
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col items-center gap-2">
          <DialogTitle className="font-montserrat font-bold text-xl sm:text-[28px] leading-tight text-center">
            Institution Details
          </DialogTitle>
          <DialogDescription className="font-montserrat font-normal text-sm sm:text-[16px] leading-relaxed text-center text-gray-600">
            Provide key information about your institution to get started
          </DialogDescription>
        </DialogHeader>

        <Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-[30px]">
              <div>
                <InputField
                  label="Institute Type"
                  name="instituteType"
                  value={formData.instituteType}
                  onChange={(e) => {
                    handleChange(e);
                    if (onInstituteTypeChange) {
                      onInstituteTypeChange(e.target.value);
                    }
                  }}
                  isSelect
                  options={[
                    "Kindergarten/childcare center",
                    "School's",
                    "Intermediate college(K12)",
                    "Under Graduation/Post Graduation",
                    "Coaching centers",
                    "Study Halls",
                    "Tution Center's",
                    "Study Abroad",
                  ]}
                  required
                  error={
                    submitted || errors.instituteType
                      ? errors.instituteType
                      : ""
                  }
                />
              </div>

              <div>
                <InputField
                  label="Institute Name"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleChange}
                  placeholder="Enter your Institute name"
                  required
                  error={
                    submitted || errors.instituteName
                      ? errors.instituteName
                      : ""
                  }
                  // className="w-[400px] h-[22px] text-[#060B13] font-montserrat font-medium text-[18px] leading-[22px] placeholder-gray-400 focus:outline-none"
                />
              </div>

              {formData.instituteType !== "Study Halls" && formData.instituteType !== "Study Abroad" && (
                <>
                  <div>
                    <InputField
                      label="Recognition by"
                      name="approvedBy" // Renamed from approvedBy
                      value={formData.approvedBy} // Renamed from approvedBy
                      onChange={handleChange}
                      placeholder="State Recognised"
                      required
                      error={
                        submitted || errors.approvedBy ? errors.approvedBy : "" // Renamed from approvedBy
                      }
                    />
                  </div>

                  <div>
                    <InputField
                      label="Establishment Date"
                      name="establishmentDate"
                      type="date"
                      value={formData.establishmentDate}
                      onChange={handleChange}
                      required
                      error={
                        submitted || errors.establishmentDate
                          ? errors.establishmentDate
                          : ""
                      }
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 w-full relative">
                {/* Label */}
                <label
                  htmlFor="contactInfo"
                  className="font-montserrat font-normal text-base text-black"
                >
                  Contact Info<span className="text-red-500 ml-1">*</span>
                </label>

                {/* Input Row */}
                {/* <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-white border border-[#DADADD] rounded-[12px]"> */}
                <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-[#F5F6F9] border border-[#DADADD] rounded-[12px]">
                  {/* Left placeholder / icon */}
                  <img
                    src="call log icon.png"
                    alt="phone icon"
                    className="w-[20px] h-[20px] object-cover"
                  />

                  {/* Flag + Dropdown */}
                  <div
                    className="flex items-center gap-2 cursor-pointer relative"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img
                      src={selectedCountryContact.flag}
                      alt={selectedCountryContact.code}
                      className="w-[20px] h-[14px] object-cover rounded-sm"
                    />
                    <span className="text-[#060B13]">
                      {selectedCountryContact.dialCode}
                    </span>

                    <svg
                      className={`w-4 h-4 text-[#060B13] transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>

                    {isDropdownOpen && (
                      <ul className="absolute top-full left-0 mt-1 w-[80px] max-h-40 overflow-y-auto bg-white border border-[#DADADD] rounded-md z-50">
                        {countries.map((country) => (
                          <li
                            key={country.code}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-center"
                            onClick={() => {
                              handleCountrySelect("contact", country);
                              setIsDropdownOpen(false);
                            }}
                          >
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
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="flex-1 text-[#060B13] font-montserrat text-[16px] sm:text-[16px] leading-[20px] focus:outline-none"
                    // className="flex-1 text-[#060B13] font-montserrat text-[16px] sm:text-[16px] leading-[20px] focus:outline-none"
                  />
                </div>

                {errors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactInfo}
                  </p>
                )}
              </div>

              {/* Repeat same for additionalContactInfo */}
              <div className="flex flex-col gap-3 w-full relative">
                <label
                  htmlFor="contactInfo"
                  className="font-montserrat font-normal text-base text-gray-950"
                >
                  Additional Contact
                </label>
                <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-[#F5F6F9] border border-[#DADADD] rounded-[12px]">
                  {/* <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-white border border-[#DADADD] rounded-[12px]"> */}
                  <img
                    src="call log icon.png"
                    alt="phone icon"
                    className="w-[20px] h-[20px] object-cover"
                  />

                  <div
                    className="flex items-center gap-2 cursor-pointer relative"
                    onClick={() =>
                      setIsDropdownOpenAdditional(!isDropdownOpenAdditional)
                    }
                  >
                    <img
                      src={selectedCountryAdditional.flag}
                      alt={selectedCountryAdditional.code}
                      className="w-[20px] h-[14px] object-cover rounded-sm"
                    />
                    <span className="text-[#060B13]">
                      {selectedCountryAdditional.dialCode}
                    </span>

                    <svg
                      className={`w-4 h-4 text-[#060B13] transition-transform ${
                        isDropdownOpenAdditional ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>

                    {isDropdownOpenAdditional && (
                      <ul className="absolute top-full left-0 mt-1 w-[80px] max-h-40 overflow-y-auto bg-white border border-[#DADADD] rounded-md z-50">
                        {countries.map((country) => (
                          <li
                            key={country.code}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-center"
                            onClick={() => {
                              handleCountrySelect("additional", country);
                              setIsDropdownOpenAdditional(false);
                            }}
                          >
                            {country.dialCode}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    id="additionalContactInfo"
                    name="additionalContactInfo"
                    type="tel"
                    maxLength={10}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="00000 00000"
                    value={formData.additionalContactInfo}
                    onChange={handleChange}
                    className="flex-1 text-[#060B13] font-montserrat text-[16px] leading-[20px]
             bg-[#F5F6F9] focus:bg-[#F5F6F9] active:bg-[#F5F6F9] 
             focus:outline-none"
                  />
                </div>
                {errors.additionalContactInfo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.additionalContactInfo}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  label="Main Campus Address"
                  name="headquartersAddress"
                  value={formData.headquartersAddress}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                  error={
                    submitted || errors.headquartersAddress
                      ? errors.headquartersAddress
                      : ""
                  }
                />
              </div>

              <div>
                <InputField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                  error={submitted || errors.state ? errors.state : ""}
                />
              </div>

              <div>
                <InputField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  numericOnly
                  required
                  error={submitted || errors.pincode ? errors.pincode : ""}
                />
              </div>

              <div>
                <InputField
                  label="Google Maps Link"
                  name="locationURL"
                  value={formData.locationURL}
                  onChange={handleChange}
                  placeholder="Paste the URL"
                  required
                  error={
                    submitted || errors.locationURL ? errors.locationURL : ""
                  }
                />
              </div>

              {/* <div className="grid md:grid-cols-1 gap-6">
                <label className="font-medium text-[16px]">{"Logo"}</label>
                <label className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] transition-colors">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    "Upload Logo (jpg / png)"
                  </span>
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    
                    // className="hidden"
                    onChange={(e) => handleFileChange(e)}
                    // required
                  />
                </label>
              </div> */}
              {/* <div>
                <label className="font-montserrat font-normal text-base text-black">
                  Logo <span className="text-red-500">*</span>
                </label>

                <div
                  className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA]
               flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2]
               transition-colors mt-2 relative"
                >
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {!formData.logoPreviewUrl ? (
                    <>
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Upload Logo (jpg / png)
                      </span>
                    </>
                  ) : (
                    <img
                      src={formData.logoPreviewUrl}
                      alt="Logo preview"
                      className="w-[100px] h-[100px] object-cover rounded-md"
                    />
                  )}
                </div>

                {errors.logoUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.logoUrl}</p>
                )}
              </div> */}

              {formData.instituteType !== "Study Abroad" && (
                <div>
                  <label className="font-montserrat font-normal text-base text-black">
                    Logo <span className="text-red-500">*</span>
                  </label>

                  <div
                    className="w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA]
       flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2]
       transition-colors mt-2 relative"
                  >
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />

                    {!formData.logoPreviewUrl ? (
                      <>
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Logo (jpg / jpeg / png)
                        </span>
                      </>
                    ) : (
                      <img
                        src={formData.logoPreviewUrl}
                        alt="Logo preview"
                        className="w-[100px] h-[100px] object-cover rounded-md"
                      />
                    )}
                  </div>

                  {/* ✅ Show validation error here */}
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full max-w-[500px] h-[48px] mt-5 mx-auto rounded-[12px] font-semibold transition-colors ${
                  isFormComplete && !isLoading
                    ? "bg-[#0222D7] text-white"
                    : "bg-[#697282] text-white"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
