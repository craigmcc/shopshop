"use client";

// @/components/tanstack-form/SubmitButton.tsx

/**
 * TanStack Form submit button.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { LoaderCircle } from "lucide-react";

// Internal Modules ----------------------------------------------------------

import { useFormContext } from "@/components/tanstack-form/useAppContexts";
import {ButtonHTMLAttributes} from "react";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the button.
  className?: string,
  // Are we creating a new object?  [false]
  isCreating?: boolean,
  // Optional label for the button.  [Save]
  label?: string,
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function SubmitButton({ className, isCreating, label }: Props) {

  const form = useFormContext();
  const { isSubmitting } = form.state;

  return (
    <form.Subscribe
      selector={(state) =>
        isCreating ? state.isValid && !state.isPristine : state.isValid}
    >
      {(canSubmit) => (
        <button
          className={`btn btn-primary ${className}`}
          disabled={!canSubmit}
          role="button"
          type="submit"
        >
          {isSubmitting
            ? <LoaderCircle className="animate-spin"/>
            : <span>{label ? label : "Save"}</span>
          }
        </button>
      )}
    </form.Subscribe>
  )



  {/*
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
    >
    onChange={(state) => {
        <button
          className={`btn btn-primary ${className}`}
          disabled={isSubmitting} // TODO - or errors
          type="submit"
        >
          {label}
          {isSubmitting && <LoaderCircle className="animate-spin"/>}
        </button>}
    </form.Subscribe>
*/}

}
