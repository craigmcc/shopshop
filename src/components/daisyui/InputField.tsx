"use client"

// @/components/fields/InputField.tsx

/**
 * RHF input field for a text field with a label.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
  className?: string,
  label: string,
  name: string,
  placeholder?: string,
} & InputHTMLAttributes<HTMLInputElement>;

export function InputField({
  className, label, name, placeholder, ...props
}: Props) {

  const { register, formState: { errors } } = useFormContext();
  const message = errors[name] ? errors[name].message : undefined;

  return (
    <label className="form-control w-full pb-2 flex flex-col">
      <div className="label">
        <label className="label-text" htmlFor={name}>{label}</label>
        {/*<span className="label-text-alt">Optional Right Label</span>*/}
      </div>
      <input
        className={`input input-bordered border-2 w-full max-w-xs ${className}`}
        placeholder={placeholder ? placeholder : undefined}
        type="text"
        {...register(name)}
        {...props}
      />
        {message && (typeof message === "string") && (message.length > 0) && (
          <div className="label">
            <span className="label-text-alt text-error">
              {message}
            </span>
          </div>
        )}
    </label>
  )

}
