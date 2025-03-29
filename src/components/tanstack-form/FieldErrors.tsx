"use client";

// @/components/tanstack-form/FieldInfo.tsx

/**
 * TanStack Form field info component.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {AnyFieldApi} from "@tanstack/form-core";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function FieldErrors({ field }: { field: AnyFieldApi }) {
  return (
    <>
    {field.state.meta.errors && (
      <div className="label">
        <span className="label-text-alt text-error">
          {field.state.meta.errors.map((e => e.message)).join(', ')}
        </span>
      </div>
      )}
    </>
  )
}
