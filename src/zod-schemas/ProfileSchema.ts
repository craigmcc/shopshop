// @/zod-schemas/ProfileSchema.ts

/**
 * Zod schema for Profile models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { object, string } from "zod";

// Public Objects ------------------------------------------------------------

export const ProfileSchema = object({
  email: string().email("Invalid email address"),
  imageUrl: string().url("Invalid image URL").optional(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required"),
  scope: string().optional(), // TODO - get rid of this
});

export type ProfileSchemaType = typeof ProfileSchema._type;

export const ProfileSchemaUpdate = ProfileSchema.partial();

export type ProfileSchemaUpdateType = typeof ProfileSchemaUpdate._type;
