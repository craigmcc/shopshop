// @/zod-schemas/CategorySchema.ts

/**
 * Zod schemas for Category models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { object, string } from "zod";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const CategoryCreateSchema = object({
  listId: string().uuid(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
});

export type CategoryCreateSchemaType = typeof CategoryCreateSchema._type;

export const CategoryUpdateSchema = CategoryCreateSchema
  .partial()
  .omit({ listId: true });

export type CategoryUpdateSchemaType = typeof CategoryUpdateSchema._type;
