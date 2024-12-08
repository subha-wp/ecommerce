import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

// Helper function to validate phone numbers
const phoneRegex = /^[0-9]{10}$/;

const loginIdentifierSchema = z
  .string()
  .min(1, "Required")
  .refine((value) => {
    // Check if value is an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if value is a phone number
    const isValidPhone = phoneRegex.test(value);

    return emailRegex.test(value) || isValidPhone;
  }, "Please enter a valid email or 10-digit phone number");

export const signUpSchema = z.object({
  name: requiredString.min(2, "Name must be at least 2 characters"),
  identifier: loginIdentifierSchema,
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export const loginSchema = z.object({
  identifier: loginIdentifierSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
