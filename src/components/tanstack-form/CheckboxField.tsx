"use client"

// @/components/tanstack-form/CheckboxField.tsx

/**
 * TanStack Form checkbox field for a checkbox with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {FieldErrors} from "@/components/tanstack-form/FieldErrors";
import { useFieldContext } from "@/components/tanstack-form/useAppContexts";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the checkbox field.
  className?: string,
  // The label for the checkbox field.
  label: string,
};

export function CheckboxField({ className, label }: Props) {

  const field = useFieldContext<boolean>();

  return (
    <label className="form-control w-full pb-2 flex flex-col">
      <input
        checked={field.state.value}
        className={`checkbox ${className}`}
        id={field.name}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.checked)}
        type="checkbox"
      />
      <legend className="fieldset-legend">
        <label htmlFor={field.name}>{label}</label>
      </legend>
      <FieldErrors field={field} />
    </label>
  );

}
