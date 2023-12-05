"use client";
// @/components/lists/ListIdPageContent.tsx

/**
 * Interactive content for the "List ID" page where Users select what Items
 * they want on the current List, and checking them off when that Item has
 * been purchased.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { CategoryWithItems } from "@/types/types";

// Public Objects ------------------------------------------------------------

interface ListIdPageContentProps {
  // The Categories (with nested Items) for this List
  categories: CategoryWithItems[];
  // The List whose Categories and Items are being managed
  list: List;
}

export const ListIdPageContent = ({
  categories,
  list,
}: ListIdPageContentProps) => {
  return (
    <div>
      ListIdPageContent for List {list.id} ({list.name}).
    </div>
  );
};
