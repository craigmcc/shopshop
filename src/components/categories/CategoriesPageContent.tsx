"use client";
// @/components/categories/CategoriesPageContent.tsx

/**
 * Interactive content for the "Categories and Items" management page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useState } from "react";
import { Category, Item, List } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { CategoryTable } from "@/components/categories/CategoryTable";
import { ItemTable } from "@/components/items/ItemTable";
import { CategoryWithItems } from "@/types/types";

// Public Objects ------------------------------------------------------------

interface CategoriesPageContentProps {
  // The Categories (with nested Items) for this List
  categories: CategoryWithItems[];
  // The List whose Categories are being managed
  list: List;
}

export const CategoriesPageContent = ({
  categories,
  list,
}: CategoriesPageContentProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const onSelect = (newCategory: CategoryWithItems) => {
    setSelectedCategory(newCategory);
    setItems(newCategory.items);
  };

  return (
    <div className="grid grid-cols-2 space-x-3 p-1">
      <CategoryTable categories={categories} list={list} onSelect={onSelect} />
      {selectedCategory ? (
        <ItemTable category={selectedCategory} items={items} list={list} />
      ) : null}
    </div>
  );
};
