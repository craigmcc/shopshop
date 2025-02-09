// @/zod-schemas/CategorySchema.ts

/**
 * Zod schema for Category models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { object, string } from "zod";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const CategorySchema = object({
  listId: string().uuid(),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
});

export type CategorySchemaType = typeof CategorySchema._type;
