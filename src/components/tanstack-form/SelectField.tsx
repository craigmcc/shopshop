"use client";

// @/components/tanstack-form/SelectField.tsx

/**
 * TanStack Form select field for a select with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { SelectHTMLAttributes } from "react";

// Internal Modules ----------------------------------------------------------

import {FieldErrors} from "@/components/tanstack-form/FieldErrors";
import { useFieldContext } from "@/components/tanstack-form/useAppContexts";
import { SelectOption } from "@/types/types";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the select field.
  className?: string;
  // The label for the select field.
  label: string;
  // The options for the select field.
  options: SelectOption[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ className, label, options, ...props }: Props) {

  const field = useFieldContext<string>();

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">
        <label htmlFor={field.name}>{label}</label>
      </legend>
      <select
        className={`select w-full ${className ? className : ""}`}
        id={field.name}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
        {...props}
      >
        {options.map((option) => (
          <option
            disabled={option.value === ""}
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrors field={field} />
    </fieldset>
  );

}
