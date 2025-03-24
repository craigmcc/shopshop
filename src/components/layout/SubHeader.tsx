"use client";

// @/components/layout/SubHeader.tsx

/**
 * Sub-header for the main page area, with optional "Back" and "Add" buttons.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { AddButton } from "@/components/shared/AddButton";
import { BackButton } from "@/components/shared/BackButton";

// Public Objects ------------------------------------------------------------

export type Props = {
  // URL of the "Add" page to navigate to, if any
  hrefAdd?: string;
  // URL of the "Back" page to return to, if any (or true for the previous page)
  hrefBack?: string | boolean;
  // Title for the sub-header
  title: string;
}

export function SubHeader({ hrefAdd, hrefBack, title }: Props) {

  const router = useRouter();

  function onBack() {
    if (hrefBack === true) {
      router.back();
    } else if (typeof hrefBack === "string") {
      router.push(hrefBack);
    }
  }

  return (
    <div className="flex justify-between items-center gap-3 pb-2">
      <div>
        {hrefBack ? (
          <BackButton onClick={onBack} />
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
