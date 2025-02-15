// @/zod-schemas/ItemSchema.ts

/**
 * Zod schema for Item models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { boolean, object, string } from "zod";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const ItemSchema = object({
  categoryId: string().uuid(),
  checked: boolean().optional(),
  listId: string().uuid(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  notes: string().optional(),
  selected: boolean().optional(),
});

export type ItemSchemaType = typeof ItemSchema._type;

export const ItemSchemaUpdate = ItemSchema
  .partial()
  .omit({ categoryId: true, listId: true });

export type ItemSchemaUpdateType = typeof ItemSchemaUpdate._type;
