// @/zod-schemas/signInSchema.ts

/**
 * Zod schema for SignInForm.
 *
 * @packageDocumentation
 */

import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type signInSchemaType = typeof signInSchema._type;
