// @/components/layout/SubHeader.tsx

/**
 * Sub-header for the main page area, with optional "Back" and "Add" buttons.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { AddButton } from "@/components/shared/AddButton";
import { BackButton } from "@/components/shared/BackButton";

// Public Objects ------------------------------------------------------------

export type Props = {
  // URL of the "Add" page to navigate to, if any
  hrefAdd?: string;
  // URL of the "Back" page to return to, if any
  hrefBack?: string;
  // Title for the sub-header
  title: string;
}

export async function SubHeader({ hrefAdd, hrefBack, title }: Props) {

  return (
    <div className="flex justify-between items-center gap-3 pb-2">
      <div>
        {hrefBack ? (
          <BackButton href={hrefBack} />
        ) : ( <span></span>)}
      </div>
      <h2 className="font-semibold text-2xl">{title}</h2>
      <div>
        {hrefAdd ? (
          <AddButton href={hrefAdd} />
        ) : (
          <span></span>
        )}
      </div>
    </div>
  )

}
