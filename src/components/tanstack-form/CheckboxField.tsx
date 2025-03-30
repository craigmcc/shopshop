"use client"

// @/components/tanstack-form/CheckboxField.tsx

/**
 * TanStack Form checkbox field for a checkbox with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

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
  const {
    state: {
      value,
      meta: { errors, isTouched },
    },
  } = useFieldContext<boolean>();

  const errorMessage = isTouched
    ? errors.map((e) => e.message).join(", ")
    : undefined;

  return (
    <label className="form-control w-full pb-2 flex flex-col">
      <div className="label">
        <label className="label-text" htmlFor={field.name}>
          {label}
        </label>
        {/*<span className="label-text-alt">Optional Right Label</span>*/}
      </div>
      <input
        checked={value}
        className={`checkbox ${className}`}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.checked)}
        type="checkbox"
      />
      {errorMessage &&
        <div className="label-text-alt text-error">
          {errorMessage}
        </div>
      }
    </label>
  );

}
