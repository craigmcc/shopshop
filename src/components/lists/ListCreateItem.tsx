"use client"
// @/components/lists/ListCreateItem.tsx

/**
 * Navigation item to create a new List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import {ActionTooltip} from "@/components/shared/ActionTooltip";
import {Icons} from "@/components/shared/Icons";
import {useCurrentProfile} from "@/hooks/useCurrentProfile";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

export const ListCreateItem = () => {

    const {onOpen} = useModalStore();
    const profile = useCurrentProfile();
    if (!profile) {
        alert("Must be signed in to access this page"); // TODO - better formatting
        return redirect("/"); // TODO - redirect to sign in page?
    }

    return (
        <div>
            <ActionTooltip
                align="center"
                label="Create a new List"
                side="right"
            >
                <button
                    onClick={() => onOpen(ModalType.LIST_FORM,  { profile })}
                    className="group flex items-center"
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Icons.Add
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )

}
