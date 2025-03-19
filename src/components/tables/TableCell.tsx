// @/components/tables/TableCell.tsx

/**
 * Shared TableCell component for editable TanStack tables.
 * Renders the raw data or an input field, depending on the edit state.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import React, {ChangeEvent, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// For SELECT elements
type Option = {
  label: string;
  value: string;
};

// @ts-expect-error "any" types should maybe be replaced
export function TableCell({ getValue, row, column, table }) {

  const columnMeta = column.columnDef.meta;
  const initialValue = getValue()
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onBlur = () => {
    tableMeta.updateData(row.index, column.id, value)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };

  if (tableMeta?.editedRows[row.id]) {

    return columnMeta?.type === "select" ? (

      <select onChange={onSelectChange} value={initialValue}>
        {columnMeta?.options?.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

    ) : (

      <input
        className="input input-bordered w-full"
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
        value={value}
      />

    )
  }

  return <span>{value}</span>

}
