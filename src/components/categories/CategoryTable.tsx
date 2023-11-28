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
import { ModalType, useModalStore } from "@/hooks/useModalStore";
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
  const { onOpen } = useModalStore();

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
            <TableHead className="p-2">
              <ActionTooltip align="center" label="Add Category" side="right">
                <button
                  className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700"
                  onClick={() => onOpen(ModalType.CATEGORY_FORM, { list })}
                >
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
                  <button
                    className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700"
                    onClick={() =>
                      onOpen(ModalType.CATEGORY_FORM, { category, list })
                    }
                  >
                    <Icons.Settings className="h-4 w-4" />
                  </button>
                </ActionTooltip>
              </TableCell>
              <TableCell className="p-2">
                <ActionTooltip
                  align="center"
                  label="Remove Category"
                  side="right"
                >
                  <button
                    className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700"
                    onClick={() =>
                      onOpen(ModalType.CATEGORY_REMOVE, { category })
                    }
                  >
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
