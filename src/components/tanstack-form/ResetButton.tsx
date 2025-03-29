"use client";

// @/components/tanstack-form/ResetButton.tsx

/**
 * TanStack Form reset button.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { useFormContext } from "@/components/tanstack-form/useAppContexts";
import {ButtonHTMLAttributes} from "react";

// Public Objects ------------------------------------------------------------

type Props = {
  // Optional CSS classes to apply to the button.
  className?: string,
  // Optional label for the button.  [Reset]
  label?: string,
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ResetButton({ className, label }: Props) {

  const form = useFormContext();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        form.reset();
      }}
      className={`btn btn-accent ${className}`}
      type="button"
    >
      <span>{label ? label : "Reset"}</span>
    </button>
  )

}
