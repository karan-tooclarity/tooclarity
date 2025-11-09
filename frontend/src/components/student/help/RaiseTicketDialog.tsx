"use client";

import React, { useState } from "react";
import {
  _Dialog,
  _DialogContent,
  _DialogHeader,
  _DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/components/ui/InputField";
import styles from "./RaiseTicketDialog.module.css";

interface RaiseTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: TicketFormData) => void;
}

export interface TicketFormData {
  subject: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "";
  attachment?: File | null;
}

interface TicketFormErrors {
  subject?: string;
  category?: string;
  description?: string;
  priority?: string;
}

const categories = [
  "Technical Issue",
  "Billing & Payment",
  "Course Information",
  "Account & Profile",
  "Counselling",
  "General Inquiry",
  "Other",
];

const priorities = ["Low", "Medium", "High"];

export const RaiseTicketDialog: React.FC<RaiseTicketDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: "",
    category: "",
    description: "",
    priority: "",
    attachment: null,
  });

  const [errors, setErrors] = useState<TicketFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: TicketFormErrors = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TicketFormErrors]) {
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
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Reset form and close dialog on success
      setFormData({
        subject: "",
        category: "",
        description: "",
        priority: "",
        attachment: null,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject: "",
      category: "",
      description: "",
      priority: "",
      attachment: null,
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <_Dialog open={open} onOpenChange={handleClose}>
      <_DialogContent className={styles.dialogContent} showCloseButton={true}>
        <_DialogHeader className={styles.dialogHeader}>
          <_DialogTitle className={styles.title}>Raise a Ticket</_DialogTitle>
          <p className={styles.subtitle}>
            Tell us about your issue and we&apos;ll get back to you soon
          </p>
        </_DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <InputField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              required
              error={errors.subject}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Category <span className={styles.required}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${
                errors.category ? styles.selectError : ""
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={styles.errorText}>{errors.category}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Priority <span className={styles.required}>*</span>
            </label>
            <div className={styles.priorityButtons}>
              {priorities.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className={`${styles.priorityButton} ${
                    formData.priority === priority
                      ? styles.priorityButtonActive
                      : ""
                  } ${styles[`priority${priority}`]}`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, priority: priority as "Low" | "Medium" | "High" }));
                    if (errors.priority) {
                      setErrors((prev) => ({ ...prev, priority: "" }));
                    }
                  }}
                >
                  {priority}
                </button>
              ))}
            </div>
            {errors.priority && (
              <p className={styles.errorText}>{errors.priority}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please describe your issue in detail..."
              className={`${styles.textarea} ${
                errors.description ? styles.textareaError : ""
              }`}
              rows={5}
            />
            {errors.description && (
              <p className={styles.errorText}>{errors.description}</p>
            )}
          </div>

          {/* Attachment Upload */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Attachment (optional)</label>
            <input
              type="file"
              name="attachment"
              accept="image/png,image/jpeg,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  // Basic type validation (accept attribute already restricts UI)
                  const validTypes = ["image/png", "image/jpeg", "application/pdf"];
                  if (!validTypes.includes(file.type)) {
                    // Ignore invalid file type
                    return;
                  }
                }
                setFormData((prev) => ({ ...prev, attachment: file }));
              }}
              className={styles.fileInput}
            />
            {formData.attachment && (
              <p className={styles.attachmentInfo}>
                Attached: {formData.attachment.name} ({Math.round(formData.attachment.size / 1024)} KB)
              </p>
            )}
          </div>

          <div className={styles.submitButtonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </_DialogContent>
    </_Dialog>
  );
};

export default RaiseTicketDialog;
