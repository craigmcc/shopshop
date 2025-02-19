// @/zod-schemas/ProfileSchema.ts

/**
 * Zod schemas for Profile models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { object, string } from "zod";

// Public Objects ------------------------------------------------------------

export const ProfileCreateSchema = object({
  email: string().email("Invalid email address"),
  imageUrl: string().url("Invalid image URL").optional(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required"),
  scope: string().optional(), // TODO - get rid of this
});

export type ProfileCreateSchemaType = typeof ProfileCreateSchema._type;

export const ProfileUpdateSchema = ProfileCreateSchema.partial();

export type ProfileUpdateSchemaType = typeof ProfileUpdateSchema._type;
