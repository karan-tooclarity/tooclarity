"use client";

import React, { useState } from "react";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";
import Image from "next/image";
import styles from "./ScheduleCallbackDialog.module.css";

interface ScheduleCallbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CallbackFormData) => void;
}

export interface CallbackFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message?: string;
}

export const ScheduleCallbackDialog: React.FC<ScheduleCallbackDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CallbackFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<CallbackFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CallbackFormData> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof CallbackFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
        message: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting callback request:", error);
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
      message: "",
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
            <_DialogTitle className={styles.title}>
              Schedule a Call back
            </_DialogTitle>
          </_DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <InputField
              label="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Sa*****n"
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
              placeholder="9398******"
              required
              error={errors.phoneNumber}
              inputMode="numeric"
            />
          </div>

          <div className={styles.inputGroup}>
            <button
              type="button"
              className={styles.askButton}
              onClick={() => {
                // This could open a message input or redirect to chat
                console.log("Ask me anything clicked");
              }}
            >
              Ask me anything ?
            </button>
          </div>

          <div className={styles.submitButtonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </_DialogContent>
    </_Dialog>
  );
};

export default ScheduleCallbackDialog;
