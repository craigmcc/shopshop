// @/zod-schemas/listSchema.ts

/**
 * Zod schema for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {object, string} from "zod";

// Public Objects ------------------------------------------------------------

export const listSchema = object({
  id: string().optional(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  profileId: string({ required_error: "Profile ID is required"})
    .min(1, "Profile ID is required"),
});

export type listSchemaType = typeof listSchema._type;

export const removeListSchema = object({
  id: string(),
});

export type removeListSchemaType = typeof removeListSchema._type;
