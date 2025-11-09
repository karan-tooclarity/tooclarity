"use client";

import React, { useState } from "react";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";
import styles from "./BookDemoDialog.module.css";

interface BookDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: BookDemoFormData) => void;
}

export interface BookDemoFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  date: string;
  timeSlot: "10:00 AM" | "12:00 PM" | "";
}

interface BookDemoFormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  date?: string;
  timeSlot?: string;
}

export const BookDemoDialog: React.FC<BookDemoDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BookDemoFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    date: "",
    timeSlot: "",
  });

  const [errors, setErrors] = useState<BookDemoFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: BookDemoFormErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/[^0-9]/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // Validate date
    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
    }

    // Validate time slot
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof BookDemoFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTimeSlotSelect = (slot: "10:00 AM" | "12:00 PM") => {
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
    if (errors.timeSlot) {
      setErrors((prev) => ({ ...prev, timeSlot: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Reset form and close dialog on success
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        date: "",
        timeSlot: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting demo booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      date: "",
      timeSlot: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <_Dialog open={open} onOpenChange={handleClose}>
      <_DialogContent
        className={styles.dialogContent}
        showCloseButton={true}
      >
        <div className={styles.header}>
          <_DialogHeader className={styles.dialogHeader}>
            <div className={styles.titleContainer}>
              <_DialogTitle className={styles.title}>
                Book a Demo
              </_DialogTitle>
            </div>
          </_DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <InputField
              label="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sa*****an"
              required
              error={errors.fullName}
            />
          </div>

          <div className={styles.inputGroup}>
            <InputField
              label="Email Id"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ex*****@gmail.com"
              required
              error={errors.email}
            />
          </div>

          <div className={styles.inputGroup}>
            <InputField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="93*****90"
              required
              error={errors.phoneNumber}
              inputMode="numeric"
            />
          </div>

          <div className={styles.inputGroup}>
            <InputField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="DD-MM-YYYY"
              required
              error={errors.date}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.timeLabel}>Select Time</label>
            <div className={styles.timeSlots}>
              <button
                type="button"
                className={`${styles.timeSlot} ${formData.timeSlot === "10:00 AM" ? styles.timeSlotActive : ""}`}
                onClick={() => handleTimeSlotSelect("10:00 AM")}
              >
                10:00 AM
              </button>
              <button
                type="button"
                className={`${styles.timeSlot} ${formData.timeSlot === "12:00 PM" ? styles.timeSlotActive : ""}`}
                onClick={() => handleTimeSlotSelect("12:00 PM")}
              >
                12:00 PM
              </button>
            </div>
            {errors.timeSlot && (
              <p className={styles.errorText}>{errors.timeSlot}</p>
            )}
          </div>

          <div className={styles.submitButtonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </_DialogContent>
    </_Dialog>
  );
};

export default BookDemoDialog;
