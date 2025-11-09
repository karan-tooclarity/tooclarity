import Joi from "joi";


type AnyRecord = Record<string, unknown>;

export const validateField = (
  schema: Joi.ObjectSchema<AnyRecord>,
  name: string,
  value: unknown
): string | undefined => {
  const keyExists = schema.$_terms.keys?.some((k: { key?: string }) => k.key === name);
  if (!keyExists) return undefined;
  const { error } = schema.extract(name).validate(value, { abortEarly: true });
  return error ? error.details[0].message.replace('"value"', name) : undefined;
};



export const validateForm = (schema: Joi.ObjectSchema<AnyRecord>, formData: AnyRecord) => {
  const { error } = schema.validate(formData, { abortEarly: false });
  if (!error) return {};

  const errors: Record<string, string> = {};
  error.details.forEach((err) => {
    const fieldName = err.path[0] as string;
    // Ensure friendly messages (custom > fallback)
    errors[fieldName] = err.message.replace('"value"', fieldName);
  });

  return errors;
};
