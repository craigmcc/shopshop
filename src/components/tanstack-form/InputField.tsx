"use client";

// @/components/tanstack-form/InputField.tsx

/**
 * TanStack Form input field for a text field with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { InputHTMLAttributes } from "react";

// Internal Modules ----------------------------------------------------------

import { useFieldContext } from "@/components/tanstack-form/useAppContexts";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the input field.
  className?: string,
  // The label for the input field.
  label: string,
  // Optional placeholder text for the input field.
  placeholder?: string,
  // Optional HTML type for the input field. [text]
  type?: string,
} & InputHTMLAttributes<HTMLInputElement>;

export function InputField({className, label, placeholder, type, ...props}: Props) {

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
    <label className="form-control w-full pb-2 flex flex-col">
      <div className="label">
        <label className="label-text" htmlFor={field.name}>{label}</label>
        {/*<span className="label-text-alt">Optional Right Label</span>*/}
      </div>
      <input
        className={`input input-bordered w-full max-w-xs ${className}`}
        name={field.name}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder ? placeholder : undefined}
        type={type ? type : "text"}
        value={value}
        {...props}
      />
      {errorMessage && (
        <div className="label-text-alt text-error">{errorMessage}</div>
      )}
    </label>
  );

}
