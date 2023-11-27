"use client";
// @/components/lists/ListCreateItem.tsx

/**
 * Navigation item to create a new List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ActionTooltip } from "@/components/shared/ActionTooltip";
import { Icons } from "@/components/shared/Icons";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { ModalType, useModalStore } from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

export const ListCreateItem = () => {
  const { onOpen } = useModalStore();
  const profile = useCurrentProfile();
  if (!profile) {
    alert("Must be signed in to access this page"); // TODO - better formatting
    return redirect("/"); // TODO - redirect to sign in page?
  }

  return (
    <div>
      <ActionTooltip align="center" label="Create a new List" side="right">
        <button
          onClick={() => onOpen(ModalType.LIST_FORM, { profile })}
          className="group flex items-center"
        >
          <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Icons.Add
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
