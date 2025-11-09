"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  addInstitutionToDB,
  getAllInstitutionsFromDB,
  updateInstitutionInDB,
} from "@/lib/localDb";

import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
  _DialogDescription,
  _DialogTrigger,
} from "@/components/ui/dialog";
import {
  _Card,
  _CardContent,
  _CardFooter,
} from "@/components/ui/card";
import InputField from "@/components/ui/InputField";
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
  contactCountryCode?: string;
  additionalContactInfo: string;
  additionalContactCountryCode?: string;
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

  const DialogOpen = open !== undefined ? open : isOpen;
  const setDialogOpen = onOpenChange || setIsOpen;
  const activeSchema = L1Schema;

  useEffect(() => {
    if (!DialogOpen) return;

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
  }, [DialogOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    const { error } = L1Schema.validate(updatedFormData, { abortEarly: false });
    const fieldError = error?.details.find((detail) => detail.path[0] === name);

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError ? fieldError.message : undefined,
    }));

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
  const [isDropdownOpenAdditional, setIsDropdownOpenAdditional] = useState(false);

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

  useEffect(() => {
    if (
      formData.instituteType === "Study Halls" ||
      formData.instituteType === "Study Abroad"
    ) {
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

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        logo: "Logo must be a valid image file (.jpg, .jpeg, .png).",
      }));
      return;
    }

    if (selectedFile.size > MAX_LOG_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        logo: "File size must be 1 MB or less.",
      }));
      return;
    }

    if (formData.logoPreviewUrl) {
      URL.revokeObjectURL(formData.logoPreviewUrl);
    }

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

      const institutions = await getAllInstitutionsFromDB();
      const latest =
        institutions.length > 0
          ? institutions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0]
          : null;

      const isLogoChanged =
        formData.logo &&
        formData.logo instanceof File &&
        formData.logoPreviewUrl !== latest?.logoPreviewUrl;

      if (isLogoChanged && formData.logo) {
        try {
          const uploadResult = await uploadToS3(formData.logo);
          if (uploadResult.success) {
            logoUrl = uploadResult.fileUrl;
          } else {
            throw new Error(uploadResult.error || "Upload failed");
          }
        } catch (uploadError) {
          setErrors((prev) => ({
            ...prev,
            logo: "Failed to upload logo. Please try again.",
          }));
          setIsLoading(false);
          return;
        }
      }

      const dataToValidate = { ...formData, logoUrl };

      const { error } = activeSchema.validate(dataToValidate, {
        abortEarly: false,
      });
      if (error) {
        const validationErrors: Errors = {};
        error.details.forEach((err) => {
          const fieldName = err.path[0] as string;
          validationErrors[fieldName] = err.message.replace(
            `"${fieldName}"`,
            fieldName
          );
        });
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      setErrors({});

      const currentData = { ...dataToValidate };
      delete (currentData as any).logo;

      if (latest) {
        await updateInstitutionInDB({ ...latest, ...currentData });
      } else {
        await addInstitutionToDB(currentData);
      }
      
      localStorage.setItem("institutionType", currentData.instituteType);

      onSuccess?.();
      setDialogOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = !activeSchema.validate(formData, {
    abortEarly: false,
  }).error;

  return (
    <_Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <_DialogTrigger asChild>{trigger}</_DialogTrigger>}
      <_DialogContent
        className="w-[95vw] sm:w-[90vw] md:w-[800px] lg:w-[900px] xl:max-w-4xl scrollbar-hide top-[65%]"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <_DialogHeader className="flex flex-col items-center gap-2">
          <_DialogTitle className="font-montserrat font-bold text-xl sm:text-[28px] leading-tight text-center">
            Institution Details
          </_DialogTitle>
          <_DialogDescription className="font-montserrat font-normal text-sm sm:text-[16px] leading-relaxed text-center text-gray-600">
            Provide key information about your institution to get started
          </_DialogDescription>
        </_DialogHeader>

        <_Card className="w-full sm:p-6 rounded-[24px] bg-white border-0 shadow-none">
          <form onSubmit={handleSubmit}>
            <_CardContent className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-[30px]">
              <InputField
                label="Institute Type"
                name="instituteType"
                value={formData.instituteType}
                onChange={handleChange}
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
                error={errors.instituteType}
              />

              <InputField
                label="Institute Name"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                placeholder="Enter your Institute name"
                required
                error={errors.instituteName}
              />

              {formData.instituteType !== "Study Halls" &&
                formData.instituteType !== "Study Abroad" && (
                  <>
                    <InputField
                      label="Recognition by"
                      name="approvedBy"
                      value={formData.approvedBy}
                      onChange={handleChange}
                      placeholder="State Recognised"
                      required
                      error={errors.approvedBy}
                    />

                    <InputField
                      label="Establishment Date"
                      name="establishmentDate"
                      type="date"
                      value={formData.establishmentDate}
                      onChange={handleChange}
                      required
                      error={errors.establishmentDate}
                    />
                  </>
                )}

              <div className="flex flex-col gap-3 w-full relative">
                <label
                  htmlFor="contactInfo"
                  className="font-montserrat font-normal text-base text-black"
                >
                  Contact Info<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-[#F5F6F9] border border-[#DADADD] rounded-[12px]">
                  <Image
                    src="/call log icon.png"
                    alt="phone icon"
                    width={20}
                    height={20}
                  />
                  <div
                    className="flex items-center gap-2 cursor-pointer relative"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <Image
                      src={selectedCountryContact.flag}
                      alt={selectedCountryContact.code}
                      width={20}
                      height={14}
                    />
                    <span>{selectedCountryContact.dialCode}</span>
                    {isDropdownOpen && (
                      <ul className="absolute top-full left-0 mt-1 w-[80px] max-h-40 overflow-y-auto bg-white border rounded-md z-50">
                        {countries.map((country) => (
                          <li
                            key={country.code}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                            onClick={() => handleCountrySelect("contact", country)}
                          >
                            {country.dialCode}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    id="contactInfo"
                    name="contactInfo"
                    type="tel"
                    maxLength={10}
                    placeholder="00000 00000"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="flex-1 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-3 w-full relative">
                <label
                  htmlFor="additionalContactInfo"
                  className="font-montserrat font-normal text-base text-black"
                >
                  Additional Contact
                </label>
                <div className="flex flex-row items-center gap-3 px-4 h-[48px] w-full bg-[#F5F6F9] border border-[#DADADD] rounded-[12px]">
                  <Image
                    src="/call log icon.png"
                    alt="phone icon"
                    width={20}
                    height={20}
                  />
                  <div
                    className="flex items-center gap-2 cursor-pointer relative"
                    onClick={() => setIsDropdownOpenAdditional(!isDropdownOpenAdditional)}
                  >
                    <Image
                      src={selectedCountryAdditional.flag}
                      alt={selectedCountryAdditional.code}
                      width={20}
                      height={14}
                    />
                    <span>{selectedCountryAdditional.dialCode}</span>
                    {isDropdownOpenAdditional && (
                      <ul className="absolute top-full left-0 mt-1 w-[80px] max-h-40 overflow-y-auto bg-white border rounded-md z-50">
                        {countries.map((country) => (
                          <li
                            key={country.code}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                            onClick={() => handleCountrySelect("additional", country)}
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
                    placeholder="00000 00000"
                    value={formData.additionalContactInfo}
                    onChange={handleChange}
                    className="flex-1 bg-transparent focus:outline-none"
                  />
                </div>
                {errors.additionalContactInfo && (
                  <p className="text-red-500 text-sm mt-1">{errors.additionalContactInfo}</p>
                )}
              </div>

              <InputField
                label="Main Campus Address"
                name="headquartersAddress"
                value={formData.headquartersAddress}
                onChange={handleChange}
                placeholder="Enter address"
                required
                error={errors.headquartersAddress}
              />

              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
                error={errors.state}
              />

              <InputField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                type="tel"
                maxLength={6}
                required
                error={errors.pincode}
              />

              <InputField
                label="Google Maps Link"
                name="locationURL"
                value={formData.locationURL}
                onChange={handleChange}
                placeholder="Paste the URL"
                required
                error={errors.locationURL}
              />

              {formData.instituteType !== "Study Abroad" && formData.instituteType !== "Study Halls" && (
                <div>
                  <label className="font-montserrat font-normal text-base text-black">
                    Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 w-full h-[120px] rounded-[12px] border-2 border-dashed border-[#DADADD] bg-[#F8F9FA] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F1F2] relative">
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
                      <Image
                        src={formData.logoPreviewUrl}
                        alt="Logo preview"
                        width={100}
                        height={100}
                        className="w-[100px] h-[100px] object-cover rounded-md"
                      />
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                  )}
                </div>
              )}
            </_CardContent>

            <_CardFooter>
              <Button
                type="submit"
                disabled={isLoading || !isFormComplete}
                className={`w-full max-w-[500px] h-[48px] mt-5 mx-auto rounded-[12px] font-semibold transition-colors ${
                  isFormComplete && !isLoading
                    ? "bg-[#0222D7] text-white"
                    : "bg-gray-400 text-white cursor-not-allowed"
                } ${isLoading ? "opacity-50" : ""}`}
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </Button>
            </_CardFooter>
          </form>
        </_Card>
      </_DialogContent>
    </_Dialog>
  );
}