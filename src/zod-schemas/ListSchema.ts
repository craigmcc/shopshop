// @/zod-schemas/ListSchema.ts

/**
 * Zod schemas for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { boolean, object, string } from "zod";

// Public Objects ------------------------------------------------------------

export const ListCreateSchema = object({
  imageUrl: string().url("Invalid image URL").optional(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  private: boolean().default(false).optional(),
});

export type ListCreateSchemaType = typeof ListCreateSchema._type;

export const ListUpdateSchema = ListCreateSchema.partial();

export type ListUpdateSchemaType = typeof ListUpdateSchema._type;
