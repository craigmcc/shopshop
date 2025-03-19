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
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState} from "react";

// Internal Modules ----------------------------------------------------------

import { EditCell } from "@/components/tables/EditCell";
import { FooterCell } from "@/components/tables/FooterCell";
import { TableCell } from "@/components/tables/TableCell";
import { useCurrentListContext } from "@/contexts/CurrentListContext";
import { logger } from "@/lib/ClientLogger";

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

  const [data, setData] = useState<Category[]>(categories);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [editedRows, setEditedRows] = useState({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState(() => [...categories]);


  logger.trace({
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

  // ActionsCell definition
  const ActionsCell = ({ row }: CellContext<Category, unknown>) => {
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
  ActionsCell.displayName = "ActionsCell";



  // Column definitions
  const columnHelper = createColumnHelper<Category>();
//  const columns = useMemo(() => [
  const columns = [
    columnHelper.accessor("name", {
      cell: TableCell,
      header: () => <span className="font-bold">Category Name</span>,
      meta: {
        // NOTE - type can be "date", "select", "type", ...
//        editable: true, // TODO - add this to the cell?
        type: "text",
      }
    }),
    columnHelper.display({
      cell: EditCell,
      header: "Edit",
      id: "edit",
    }),
    columnHelper.display({
      cell: ActionsCell,
      header: () => <span className="font-bold">Actions</span>,
      id: "actions",
    }),
  ]

  // Overall table instance
  const table = useReactTable({
    columns,
    data: data ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      addRow: () => {
        const newRow: Category = {
          id: "",
          name: "",
          listId: list.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const setFunc = (old: Category[]) => {
          return [...old, newRow];
        }
        setData(setFunc);
        setOriginalData(setFunc);
      },
      editedRows,
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: Category[]) => {
          return old.filter((_row: Category, index) => index !== rowIndex);
        }
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      setEditedRows,
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className={"card bg-base-300 shadow-xl"}>

      <table className="mt-4 rounded-lg border border-border">

        <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
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
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
        </tbody>

        <tfoot>
        <tr>
          <th colSpan={table.getCenterLeafColumns().length} align="right">
            <FooterCell table={table} />
          </th>
        </tr>
        </tfoot>

      </table>

    </div>
  )

}
