"use client";

// @/components/categories/CategoriesTable.tsx

/**
 * Table of available Categories for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, List, MemberRole } from "@prisma/client";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect,/* useMemo,*/ useRef, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ClientLogger";
import { useCurrentListContext } from "@/contexts/CurrentListContext";

// Public Objects ------------------------------------------------------------

type Props = {
  // Categories for this List
  categories: Category[],
  // List that owns these Categories
  list: List,
  // Current Profile's MemberRole for this List
  memberRole: MemberRole,
}

const fallbackData: Category[] = [];

export function CategoriesTable({ categories, list, memberRole }: Props) {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [data] = useState<Category[]>(categories);

  logger.info({
    context: "CategoriesTable.settingCurrentList",
    list,
  })
  const { setCurrentList } = useCurrentListContext();
  setCurrentList(list);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRefs.current.every(ref => ref && !ref.contains(event.target as Node))) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // RowActions definition
  const RowActions = ({ row }: CellContext<Category, unknown>) => {
    return (
      <details
        className="dropdown dropdown-center"
        open={openDropdown === row.id}
        onClick={() => {
          setOpenDropdown(openDropdown === row.id ? null : row.id);
        }}
        ref={el => { dropdownRefs.current[row.index] = el; }}
      >
        <summary className="btn btn-ghost btn-circle">
          <MoreHorizontal />
        </summary>
        <ul className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <Link href={`/lists/${row.original.listId}/categories/${row.original.id}/settings`}>
              Edit Settings
            </Link>
          </li>
          <li>
            <Link href={`/lists/${row.original.listId}/categories/${row.original.id}/items`}>
              Manage Items
            </Link>
          </li>
          {(memberRole === MemberRole.ADMIN) && (
            <li>
              <Link href={`/lists/${row.original.listId}/categories/${row.original.id}/remove`}>
                Remove Category
              </Link>
            </li>
          )}
        </ul>
      </details>
    );
  }
  RowActions.displayName = "RowActions";

  // Column definitions
  const columnHelper = createColumnHelper<Category>();
//  const columns = useMemo(() => [
  const columns = [
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Name</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: RowActions,
    }),
  ]
    //, []);

  // Overall table instance
  const table = useReactTable({
    columns,
    data: data ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <table className="mt-4 rounded-lg border border-border">
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="p-1">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )

}
