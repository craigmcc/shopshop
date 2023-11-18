"use client"
// @/components/lists/ListSidebarSection.tsx

/**
 * Section header for ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MemberRole, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {ActionTooltip} from "@/components/shared/ActionTooltip";
import {Icons} from "@/components/shared/Icons";
import {ModalType, useModalStore} from "@/hooks/useModalStore";
import {ListWithMembersWithProfiles} from "@/types/types";

// Public Objects ------------------------------------------------------------

interface ListSidebarSectionProps {
    // Label for this section in ListSidebar
    label: string;
    // List configured for this ListSidebar
    list: ListWithMembersWithProfiles;
    // Profile of signed in user
    profile: Profile;
    // MemberRole this Profile has for this List
    role?: MemberRole;
    // Section type of this section
    sectionType: "members";
}

export const ListSidebarSection = ({
    label,
    list,
    profile,
    role,
    sectionType
}: ListSidebarSectionProps) => {

    const {onOpen} = useModalStore();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role === MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label="Manage Members" side="top">
                    <button
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        onClick={() => onOpen(ModalType.LIST_MEMBERS, {profile, list})}
                    >
                        <Icons.Settings className="h-4 w-4"/>
                    </button>
                </ActionTooltip>
            )}
        </div>
    )

}
