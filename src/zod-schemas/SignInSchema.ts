// @/zod-schemas/SignInSchema.ts

/**
 * Zod schema for SignInForm.
 *
 * @packageDocumentation
 */

import { object, string } from "zod";

export const SignInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type SignInSchemaType = typeof SignInSchema._type;
