// @/zod-schemas/ListSchema.ts

/**
 * Zod schema for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { object, string } from "zod";

// Public Objects ------------------------------------------------------------

export const ListSchema = object({
  imageUrl: string().url("Invalid image URL").optional(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
});

export type ListSchemaType = typeof ListSchema._type;
