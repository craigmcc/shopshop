"use client";

// @/components/tanstack-form/TextareaField.tsx

/**
 * TanStack Form textarea field for a textarea with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { TextareaHTMLAttributes } from "react";

// Internal Modules ----------------------------------------------------------

import { useFieldContext } from "@/components/tanstack-form/useAppContexts";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the textarea field.
  className?: string;
  // The label for the textarea field.
  label: string;
  // Optional placeholder text for the textarea field.
  placeholder?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaField({ className, label, placeholder, ...props }: Props) {

  const field = useFieldContext<string>();
  const {
    state: {
      meta: { errors, isTouched },
      value,
    },
  } = useFieldContext<string>();

  const errorMessage = isTouched
    ? errors.map((e) => e.message).join(", ")
    : undefined;

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend">{label}</legend>
      <textarea
        className={`textarea w-full max-w-xs ${className}`}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder ? placeholder : undefined}
        value={value}
        {...props}
      />
      {errorMessage && (
        <div className="fieldset-label font-bold text-error">
          {errorMessage}
        </div>
      )}
    </fieldset>
  );

}
