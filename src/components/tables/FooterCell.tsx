// @/components/tables/FooterCell.tsx

/**
 * Shared FooterCell component for the "Add" button in TanStack tables.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Plus } from "lucide-react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// @ts-expect-error "any" types should maybe be replaced
export function FooterCell({ table }) {

  const meta = table.options.meta;

  return (
    <div>
      <button
        className="btn btn-accent"
        onClick={() => meta?.addRow()}
      >
        <Plus className="icon"/>
        Add
      </button>
    </div>
  );

}
