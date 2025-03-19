// @/components/tables/EditCell.tsx

/**
 * Shared EditCell component for editable TanStack tables.
 * Contains the edit, cancel, and done buttons.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Check, Pencil, X} from "lucide-react";
import React from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// @ts-expect-error "any" types should maybe be replaced
export function EditCell({ row, table }) {

  const meta = table.options.meta

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <button className="btn btn-outline" onClick={setEditedRows} name="done">
        {/*✔*/}
        <Check/>
      </button>{" "}
      <button className="btn btn-outline p-2" onClick={setEditedRows} name="cancel">
        {/*X*/}
        <X/>
      </button>
    </>
  ) : (
    <button className="btn btn-outline" onClick={setEditedRows} name="edit">
      {/*✐*/}
      <Pencil/>
    </button>
  )

}
