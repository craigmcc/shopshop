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
  // profileId must be validated server side
});

export type listSchemaType = typeof listSchema._type;
