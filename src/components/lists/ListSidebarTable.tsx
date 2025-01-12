// @/components/lists/ListSidebarTable.tsx

"use client"

/**
 * Table of available Lists for the ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Profile } from "@prisma/client";
import Link from "next/link";

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
import {MoreHorizontal, TableOfContents} from "lucide-react";
import * as React from "react";

// Public Objects ------------------------------------------------------------

type Props = {
  lists: List[],
  profile: Profile,
};

export function ListSidebarTable({ lists /*, profile */ }: Props) {

  return (
    <div className="mt-6 rounded=lg overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>LIST NAME</TableHead>
            <TableHead><TableOfContents /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists.map((list) => (
            <TableRow key={list.id}>
              <TableCell>{list.name}</TableCell>
              <TableCell>
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

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

}
