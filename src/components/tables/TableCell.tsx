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
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement
  >(
    e: ChangeEvent<T>
  ) => {
    if (columnMeta?.validate) {
      const isValid = columnMeta.validate(e.target.value);
      if (isValid) {
        e.target.setCustomValidity("");
        setValidationMessage("");
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage);
        setValidationMessage(columnMeta.validationMessage);
      }
    } else if (e.target.validity.valid) {
      setValidationMessage("");
    } else {
      setValidationMessage(e.target.validationMessage);
    }
  };

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    displayValidationMessage(e);
    tableMeta.updateData(row.index, column.id, value, e.target.validity.valid);
  }

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    displayValidationMessage(e);
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value, e.target.validity.valid);
  };

  if (tableMeta?.editedRows[row.id]) {

    return columnMeta?.type === "select" ? (

      <select
        autoFocus={columnMeta?.autoFocus}
        onChange={onSelectChange}
        required={!columnMeta?.required}
        title={validationMessage}
        value={initialValue}
      >
        {columnMeta?.options?.map((option: Option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

    ) : (

      <input
        autoFocus={columnMeta?.autoFocus}
        className="input input-bordered w-full"
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
        pattern={columnMeta?.pattern}
        placeholder={columnMeta?.placeholder}
        required={columnMeta?.required}
        title={validationMessage}
        type={columnMeta?.type || "text"}
        value={value}
      />

    )
  }

  return <span>{value}</span>

}
