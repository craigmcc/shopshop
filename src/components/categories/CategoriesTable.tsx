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
//  Column,
//  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
//  Table,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState} from "react";

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
  const [originalData, setOriginalData] = useState<Category[]>(() => [...categories]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [validRows, setValidRows] = useState({}); // TODO: See Part 3 of the blog series for the shape of this

//  const rerender = React.useReducer(() => ({}), {})[1] // TODO ???

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
  const ActionsCell = useCallback(({ row }: CellContext<Category, unknown>) => {
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
  }, [memberRole, openDropdown]);
//  ActionsCell.displayName = "ActionsCell";

  // Column definitions
  const columnHelper = createColumnHelper<Category>();
//  const columns = useMemo(() => [
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      cell: TableCell,
      enableSorting: true,
      header: "Category Name",
      meta: {
        autoFocus: true,
        // pattern: Regex expression for pattern validation
        // placeholder: Placeholder text
        required: true,
        // NOTE - type can be "date", "select", "type", ...
//        editable: true, // TODO - add this to the cell?
        type: "text",
        validate: (value: string) => {
          return value.length > 0;
        },
        validationMessage: "Category Name is required",
      }
    }),
    columnHelper.display({
      cell: EditCell,
      enableSorting: false,
      header: "Edit",
      id: "edit",
    }),
    columnHelper.display({
      cell: ActionsCell,
      enableSorting: false,
      header: "Actions",
      id: "actions",
    }),
  ], [ActionsCell, columnHelper]);

  // Overall table instance
  const table = useReactTable<Category>({
    columns,
    data: data ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
/*
    initialState: {
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
    },
*/
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
      setValidRows,
      updateData: (rowIndex: number, columnId: string, value: string, isValid: boolean) => {
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
        setValidRows((old) => ({
          ...old,
          // @ts-expect-error ignore "any" type warning
          [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
        }));
      },
      validRows,
    },
    onPaginationChange: setPagination,
    state: {
      pagination, // Calculated automatically for client side pagination
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
                {/*// TODO - should only show these controls on sortable columns*/}
                <span>
                  {header.column.getIsSorted() === "asc" ? (
                    <ArrowUpAZ className="icon" onClick={header.column.getToggleSortingHandler()} />
                  ) : header.column.getIsSorted() === "desc" ? (
                    <ArrowDownAZ className="icon" onClick={header.column.getToggleSortingHandler()} />
                  ) : (
                    <MoreHorizontal className="icon" onClick={header.column.getToggleSortingHandler()} />
                  )}
                </span>
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
          <th colSpan={table.getCenterLeafColumns().length}>
            <FooterCell table={table} />
          </th>
        </tr>
        </tfoot>

      </table>

      {/*      <div className="h-2" />
      <div className="flex items-center gap-2">

        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
*/}
      {/*
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>

      </div>
*/}
{/*
    <div>
      Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
      {table.getRowCount().toLocaleString()} Rows
    </div>
*/}

    </div>
  )

}
