// @/zod-schemas/signUpSchema.ts

/**
 * Zod schema for SignUpForm.
 *
 * @packageDocumentation
 */

import { object, string } from "zod";

export const signUpSchema = object({
  confirmPassword: string({ required_error: "Confirm Password is required" })
    .min(1, "Confirm Password is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  password: string({ required_error: "Password is required"})
    .min(1, "Password is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type signUpSchemaType = typeof signUpSchema._type;
