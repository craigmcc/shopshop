// @/components/tables/EditCell.tsx

/**
 * Shared EditCell component for editable TanStack tables.
 * Contains the edit, cancel, and done buttons.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Check, Pencil, SquareX, Undo } from "lucide-react";
import React from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// @ts-expect-error "any" types should maybe be replaced
export function EditCell({ row, table }) {

  const meta = table.options.meta;
  const validRow = meta?.validRows[row.id];
  const disableSubmit = validRow ? Object.values(validRow)?.some(item => !item) : false;

  const removeRow = () => {
    meta?.removeRow(row.index);
  }

  const setEditedRows = (e: React.MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }))
    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel")
    }
  }

  return meta?.editedRows[row.id] ? (
    <>
      <div className="tooltip" data-tip="Save Changes">
        <button
          className="btn btn-outline btn-sm mr-2"
          disabled={disableSubmit}
          name="done"
          onClick={setEditedRows}
        >
          {/*✔*/}
          <Check/>
        </button>{" "}
      </div>
      <div className="tooltip" data-tip="Cancel Changes">
        <button className="btn btn-outline btn-sm mr-4" onClick={setEditedRows} name="cancel">
          {/*X*/}
          <Undo/>
        </button>
      </div>
      <div className="tooltip" data-tip="Remove Row">
        <button className="btn btn-outline btn-error btn-sm" onClick={removeRow} name="remove">
          {/*✕*/}
          <SquareX/>
        </button>
      </div>
    </>
  ) : (
    <div className="tooltip" data-tip="Edit or Remove Row">
      <button className="btn btn-outline btn-sm" onClick={setEditedRows} name="edit">
        {/*✐*/}
        <Pencil/>
      </button>
    </div>
  )

}
