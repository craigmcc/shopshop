"use client";

// @/components/categories/CategoriesTable.tsx

/**
 * Table of available Categories for a List.
 *
 * NOTE:  Following a blog series on how to make dynamically changing
 * and editable tables with TanStack Table:
 * https://muhimasri.com/blogs/react-editable-table/
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
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState} from "react";

// Internal Modules ----------------------------------------------------------

import { FooterCell } from "@/components/tables/FooterCell";
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

export function CategoriesTable({ categories, list, memberRole }: Props) {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();

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
        className="dropdown dropdown-center flex flex justify-center w-10px"
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
            <Link href={`/lists/${row.original.listId}/items?categoryId=${row.original.id}`}>
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
  };
  RowActions.displayName = "RowActions";

  // Column definitions
  const columnHelper = createColumnHelper<Category>();
//  const columns = useMemo(() => [
  const columns = [
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Category Name</span>,
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="font-bold">Actions</span>,
      cell: RowActions,
    }),
  ]
  // , []);

  // Overall table instance
  const table = useReactTable<Category>({
    columns,
    data: categories,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      addRow: () => {
        router.push(`/lists/${list.id}/categories/new/settings`);
      },
    },
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className={"card bg-base-300 shadow-xl min-w-200"}>

      <table className="rounded-lg border border-border table-zebra">

        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan} className="pt-4">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
        <tr>
          <th colSpan={table.getCenterLeafColumns().length}>
            <div className="divider"/>
          </th>
        </tr>
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

        <tfoot>
        <tr>
          <th colSpan={table.getCenterLeafColumns().length}>
            <div className="divider"/>
          </th>
        </tr>
        <tr>
          <th colSpan={table.getCenterLeafColumns().length}>
            <FooterCell table={table} />
          </th>
        </tr>
        </tfoot>

      </table>
    </div>
  )

}
