"use client";

// @components/items/ItemsTable.tsx

/**
 * Table of available Items for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, List, MemberRole } from "@prisma/client";
import {
  CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel, PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { Selector } from "@/components/shared/Selector";
import {FooterCell} from "@/components/tables/FooterCell";
import { SelectOption } from "@/types/types";

// Public Objects ------------------------------------------------------------

type Props = {
  // Currently selected Category (if any)
  category?: Category;
  // The options for selecting a Category (label=category.name, value=category.id)
  categoryOptions: SelectOption[];
  // Items for the currently selected Category
  items: Item[],
  // The list for which we are managing Items
  list: List,
  // Current Profile's MemberRole for this List
  memberRole: MemberRole,
}

const fallbackData: Item[] = [];

export function ItemsTable({ category, categoryOptions, items, list, memberRole }: Props) {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();
//  const [data] = useState<Item[]>(items);

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

  // Handle selection of a different Category
  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId !== "") {
      // Redirect to the selected category
      router.push(`/lists/${list.id}/items?categoryId=${selectedCategoryId}`);
      router.refresh();
    }
  }

  // RowActions definition
  const RowActions = ({ row }: CellContext<Item, unknown>) => {
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
            <Link href={`/lists/${row.original.listId}/categories/${row.original.categoryId}/items/${row.original.id}/settings`}>
              Edit Settings
            </Link>
          </li>
          {(memberRole === MemberRole.ADMIN) && (
            <li>
              <Link href={`/lists/${row.original.listId}/categories/${row.original.categoryId}/items/${row.original.id}/remove`}>
                Remove Item
              </Link>
            </li>
          )}
        </ul>
      </details>
    );
  }
  RowActions.displayName = "RowActions";

  // Column definitions
  const columnHelper = createColumnHelper<Item>();
//  const columns = useMemo(() => [
  const columns = [
    columnHelper.accessor("name", {
      header: () => <span className="font-bold">Item Name</span>,
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
    data: items ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      addRow: () => {
        if (category) {
          router.push(`/lists/${list.id}/categories/${category.id}/items/new/settings`);
        } else {
          toast.warning("You must select a Category first");
        }
      },
    },
    onPaginationChange: setPagination,
    state: {
      pagination,
    }
  });

  return (
    <div className={"card bg-base-300 shadow-xl"}>
      <table className="mt-4 rounded-lg border border-border">

        <thead>
        <tr>
          <th colSpan={table.getCenterLeafColumns().length}>
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row w-full gap-2 items-center justify-center">
                <div>
                  <label htmlFor="categorySelector" className="font-bold">Category:</label>
                </div>
                <div>
                  <Selector
                    id="category"
                    name="categorySelector"
                    options={categoryOptions}
                    value={category ? category.id : ""}
                    onChange={handleCategoryChange}
                  />
                </div>
              </div>
            </div>
            <div className="divider"/>
          </th>
        </tr>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
        <th colSpan={table.getCenterLeafColumns().length}>
          <div className="divider"/>
        </th>
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
