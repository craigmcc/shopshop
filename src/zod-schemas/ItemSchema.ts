// @/zod-schemas/ItemSchema.ts

/**
 * Zod schemas for Item models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { boolean, object, string } from "zod";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const ItemCreateSchema = object({
  categoryId: string().uuid(),
  checked: boolean().optional(),
  listId: string().uuid(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  notes: string().optional(),
  selected: boolean().optional(),
});

export type ItemCreateSchemaType = typeof ItemCreateSchema._type;

export const ItemUpdateSchema = ItemCreateSchema
  .partial()
  .omit({ categoryId: true, listId: true });

export type ItemUpdateSchemaType = typeof ItemUpdateSchema._type;
