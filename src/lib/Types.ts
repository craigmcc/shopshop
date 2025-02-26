// @/lib/Types.ts

/**
 * Common types and interfaces for the application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export type ItemWithCategory = Item & {
  category: Category;
}
