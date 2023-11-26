"use client";
// @/components/categories/CategoryTable.tsx

/**
 * List of Categories that can be edited.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useState } from "react";
import { List } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { ActionTooltip } from "@/components/shared/ActionTooltip";
import { Icons } from "@/components/shared/Icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CategoryWithItems } from "@/types/types";

// Public Objects ------------------------------------------------------------

type HandleCategory = (category: CategoryWithItems) => void;

interface CategoryTableProps {
  // The Categories (with nested Items) that are being managed
  categories: CategoryWithItems[];
  // The List these Categories belong to
  list: List;
  // Handle selection of a particular Category
  onSelect: HandleCategory;
}

export const CategoryTable = ({
  categories,
  list,
  onSelect,
}: CategoryTableProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithItems | null>(null);

  const handleCategory = (newCategory: CategoryWithItems) => {
    setSelectedCategory(newCategory);
    onSelect(newCategory);
  };

  return (
    <ScrollArea className="h-full rounded-md border border-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>
              <span className="p-1" />
              <ActionTooltip align="center" label="Add Category" side="right">
                <button className="items-center justify-center">
                  <Icons.Add className="h-4 w-4 text-green-500" />
                </button>
              </ActionTooltip>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell
                className={cn(
                  "p-2",
                  selectedCategory && category.id === selectedCategory.id
                    ? "bg-primary text-primary-foreground"
                    : undefined,
                )}
                onClick={() => handleCategory(category)}
              >
                {category.name}
              </TableCell>
              <TableCell className="p-2">
                <ActionTooltip align="center" label="Edit Category" side="left">
                  <button className="items-center justify-center">
                    <Icons.Settings className="h-4 w-4" />
                  </button>
                </ActionTooltip>
                <span className="p-2" />
                <ActionTooltip
                  align="center"
                  label="Remove Category"
                  side="right"
                >
                  <button className="items-center justify-center">
                    <Icons.Remove className="h-4 w-4 text-rose-500" />
                  </button>
                </ActionTooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
