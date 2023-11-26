"use client";
// @/components/items/ItemTable.tsx

/**
 * List of Items that can be edited.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";

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

// Public Objects ------------------------------------------------------------

interface ItemTableProps {
  // The Category these Items belong to
  category: Category;
  // The Items that are being managed
  items: Item[];
}

export const ItemTable = ({ category, items }: ItemTableProps) => {
  return (
    <ScrollArea className="h-full rounded-md border border-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Item Notes</TableHead>
            <TableHead className="p-2">
              <ActionTooltip align="center" label="Add Item" side="right">
                <button className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
                  <Icons.Add className="h-4 w-4 text-green-500" />
                </button>
              </ActionTooltip>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="p-2">{item.name}</TableCell>
              <TableCell className="p-2">{item.notes}</TableCell>
              <TableCell className="p-2">
                <ActionTooltip align="center" label="Edit Item" side="left">
                  <button className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
                    <Icons.Settings className="h-4 w-4" />
                  </button>
                </ActionTooltip>
              </TableCell>
              <TableCell className="p-2">
                <ActionTooltip align="center" label="Remove Item" side="right">
                  <button className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-[16px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
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
