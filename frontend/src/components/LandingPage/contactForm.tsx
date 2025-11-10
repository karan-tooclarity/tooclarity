"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";
import Joi from "joi";

import {
  nameRule,
  phoneRule,
  addressRule,
  } from "@/lib/validations/ValidationRules";

// -------------------- TIME PICKER --------------------
export function TimePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (time: string) => void;
}) {
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  React.useEffect(() => {
    if (hour !== null && minute !== null && onChange) {
      const formatted = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;
      onChange(formatted);
    }
  }, [hour, minute, ampm,onChange]);

  const handleSelect = () => {
    if (hour !== null && minute !== null) {
      const formatted = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")} ${ampm}`;
      onChange?.(formatted);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-black border-gray-400 hover:bg-gray-50"
        >
          {value || "Select Time"}
          <Clock className="w-4 h-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4 bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-700">Hour</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              onChange={(e) => setHour(Number(e.target.value))}
              value={hour ?? ""}
            >
              <option value="">--</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-700">Minute</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              onChange={(e) => setMinute(Number(e.target.value))}
              value={minute ?? ""}
            >
              <option value="">--</option>
              {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-700">AM/PM</label>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              onChange={(e) => setAmpm(e.target.value as "AM" | "PM")}
              value={ampm}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <Button
            onClick={handleSelect}
            className="w-full bg-blue-800 text-white hover:bg-blue-700"
          >
            Set Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default function ContactForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    institute: "",
    location: "",
    categories: [] as string[],
    date: undefined as Date | undefined,
    time: "",
    query: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const allCategories = [
    "Kindergarten / Play School",
    "School",
    "Tuition Center",
    "Intermediate / Plus Two",
    "UG / PG College or University",
    "Coaching Center",
    "Upskilling / Training Center",
    "Test Prep / Study Abroad Consultancy",
  ];

  // ✅ Joi Schema
  const scheduleDemoSchema = Joi.object({
    name: nameRule,
    phone: phoneRule,
    email: Joi.string().email({ tlds: false }).required().messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
    institute: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Institute name is required",
    }),
    location: addressRule,
    categories: Joi.array().min(1).required().messages({
      "array.min": "Please select at least one category",
    }),
    date: Joi.date().required().messages({
      "any.required": "Please select a date",
    }),
    time: Joi.string().required().messages({
      "string.empty": "Please select a time",
    }),
    query: Joi.string().allow("").max(500).messages({
      "string.max": "Queries cannot exceed 500 characters",
    }),
  });
  type FieldValue = string | string[] | undefined | Date;
  // ✅ Field-level validation
  const validateField = (key: string, value: FieldValue) => {
    const fieldSchema = scheduleDemoSchema.extract(key);
    const { error } = fieldSchema.validate(value);
    setErrors((prev) => ({
      ...prev,
      [key]: error ? error.details[0].message : undefined,
    }));
  };

  // ✅ Input handler with live validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value); // live validate field
  };

  const toggleCategory = (category: string) => {
    const updated = formData.categories.includes(category)
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category];

    setFormData((prev) => ({ ...prev, categories: updated }));
    validateField("categories", updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = scheduleDemoSchema.validate(formData, { abortEarly: false });
    const validationErrors: Record<string, string | undefined> = {};

    if (error) {
      error.details.forEach((detail) => {
        validationErrors[detail.context?.key || ""] = detail.message;
      });
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setErrors({});
      router.push("/contactUs/thank-you");
    }
  };

  return (
    <section className="flex flex-col justify-center px-4 py-12">
      <div className="mb-6 flex justify-center">

        <svg width="180" height="180" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
<rect width="69" height="69" fill="url(#pattern0_991_2449)"/>
<defs>
<pattern id="pattern0_991_2449" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlinkHref="#image0_991_2449" transform="scale(0.00125)"/>
</pattern>
<image id="image0_991_2449" width="800" height="800" preserveAspectRatio="none" xlinkHref="data:image/jpeg;base64,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"/>
</defs>
</svg>

        {/* <img
          src="/logo.png"
          alt="TooClarity Logo"
          width={150}
          height={50}
          className="mx-auto"
        /> */}
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4 text-center">
        Schedule a Demo (TOOClARITY)
      </h1>

      <div className="max-w-2xl mb-10 text-center mx-auto">
        <p className="text-gray-700 text-base sm:text-lg">
          Learn how your institution can be <b>seen, trusted, and chosen</b> by
          the right students. Discover how our transparent platform enhances
          visibility, builds credibility, and drives genuine student engagement.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto flex flex-col gap-6 text-black"
      >
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-2xl">
            Your Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full h-12 border-black"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-2xl">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full h-12 border-black"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-2xl">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full h-12 border-black"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Institute */}
        <div>
          <Label htmlFor="institute" className="text-2xl">
            Institute Name *
          </Label>
          <Input
            id="institute"
            value={formData.institute}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full h-12 border-black"
          />
          {errors.institute && (
            <p className="text-red-600 text-sm mt-1">{errors.institute}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-2xl">
            Location / Address *
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full h-12 border-black"
          />
          {errors.location && (
            <p className="text-red-600 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <Label className="text-2xl">Institute Categories *</Label>
          <p className="text-sm">(Select all that apply)</p>
          <div className="grid grid-cols-1 gap-3 mt-3">
            {allCategories.map((category) => (
              <label
                key={category}
                className={`flex items-center gap-2 p-2 border rounded-xl cursor-pointer ${
                  formData.categories.includes(category)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                <Checkbox
                  checked={formData.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="text-red-600 text-sm mt-1">{errors.categories}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <Label className="text-2xl">Schedule Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center border-black text-black"
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                {formData.date ? format(formData.date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => {
                  setFormData({ ...formData, date });
                  validateField("date", date);
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Time */}
        <div>
          <Label className="text-2xl">Select Time *</Label>
          <TimePicker
            value={formData.time}
            onChange={(time) => {
              setFormData({ ...formData, time });
              validateField("time", time);
            }}
          />
          {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
        </div>

        {/* Query */}
        <div>
          <Label htmlFor="query" className="text-2xl">
            Write down any Queries if you have?
          </Label>
          <Textarea
            id="query"
            value={formData.query}
            onChange={handleChange}
            placeholder="Your Answer"
            className="w-full border-black"
          />
          {errors.query && (
            <p className="text-red-600 text-sm mt-1">{errors.query}</p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-black text-white w-full h-12 text-lg rounded-xl"
        >
          Submit
        </Button>
      </form>
    </section>
  );
}
