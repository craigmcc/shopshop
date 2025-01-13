// @/components/lists/ListSidebarTable.tsx

"use client"

/**
 * Table of available Lists for the ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Profile } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, TableOfContents } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Internal Modules ---------------------------------------------------------

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Public Objects ------------------------------------------------------------

type Props = {
  lists: List[],
  profile: Profile,
};

export function ListSidebarTable({ lists /*, profile */ }: Props) {

  const [data] = useState<List[]>(lists);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6 rounded-lg overflow-hidden border border-border">
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

}

// Private Objects -----------------------------------------------------------

const columnHelper = createColumnHelper<List>();

const columns = [
  columnHelper.display( {
    cell: ({ row }) => {
      const list = row.original;
      return (
        <Link href={`/lists/${list.id}/items`}>
          {list.name}
        </Link>
      )
    },
    header: "List Name",
    id: "name",
  }),
  columnHelper.display( {
    cell: ({ row }) => {
      const list = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/lists/${list.id}/settings`}
                className="w-full"
                prefetch={false}
              >
                Edit Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/lists/${list.id}/remove`}
                className="w-full"
                prefetch={false}
              >
                Remove List
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    header: () => <TableOfContents />,
    id: "actions",
  }),
];

