// validation/scheduleDemoSchema.ts
import Joi from "joi";
import {
 nameRule,
 phoneRule,
 addressRule,
} from "@/lib/validations/ValidationRules"; // adjust path based on your project

export const scheduleDemoSchema = Joi.object({
  name: nameRule,
  phone: phoneRule,
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
    }),
  instituteName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Institute name is required",
  }),
  address: addressRule,
  categories: Joi.array().min(1).required().messages({
    "array.min": "Please select at least one category",
    "any.required": "Please select at least one category",
  }),
  date: Joi.date().required().messages({
    "date.base": "Please select a valid date",
    "any.required": "Schedule date is required",
  }),
  time: Joi.string().required().messages({
    "string.empty": "Please select a time",
    "any.required": "Please select a time",
  }),
  queries: Joi.string().allow("").max(500).messages({
    "string.max": "Queries cannot exceed 500 characters",
  }),
});
