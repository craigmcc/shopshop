// @/components/tables/FooterCell.tsx

/**
 * Shared FooterCell component for the "Add" button in TanStack tables.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Plus } from "lucide-react";
import React from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// @ts-expect-error "any" types should maybe be replaced
export function FooterCell({ table }) {

  const tableMeta = table.options.meta;

  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <div className="tooltip" data-tip="First Page">
          <button
            className="btn btn-circle btn-info p-1"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
        </div>
        <div className="tooltip" data-tip="Previous Page">
          <button
            className="btn btn-circle btn-info p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
        </div>
        <div className="tooltip" data-tip="Next Page">
          <button
            className="btn btn-circle btn-info p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
        </div>
        <div className="tooltip" data-tip="Last Page">
          <button
            className="btn btn-circle btn-info p-1"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
      </div>
      <div>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        <span className="text-sm p-1">|</span>
        <span className="text-sm">
            Total of {table.getRowCount().toLocaleString()} Rows
          </span>
      </div>
      <div>
        <div className="tooltip" data-tip="Add Row">
          <button
            className="btn btn-accent"
            onClick={() => tableMeta?.addRow()}
          >
            <Plus className="icon"/>
            Add
          </button>
        </div>
      </div>
    </div>
  );

}
