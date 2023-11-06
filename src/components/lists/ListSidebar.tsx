// @/components/lists/ListSidebar.tsx

/**
 * Sidebar menu for ListsIdPage.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MemberRole, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {ListSidebarHeader} from"./ListSidebarHeader";
import {Icons} from "@/components/shared/Icons";
import {ListWithMembersWithProfiles} from "@/types/types";

// Public Objects ------------------------------------------------------------

interface ListSidebarProps {
    list: ListWithMembersWithProfiles;
    profile: Profile;
}

const iconMap = {
    [MemberRole.GUEST]: <Icons.Guest className="h-4 w-4 pr-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <Icons.Admin className="h-4 w-4 pr-2 text-rose-500"/>,
}

export const ListSidebar = async ({list, profile}: ListSidebarProps) => {

    const members = list.members;
    const role = members.find((member) => member.profileId === profile.id)?.role;

    return (
        <aside className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] py-3">
            <ListSidebarHeader
                list={list}
                profile={profile}
                role={role}
            />
        </aside>
    )

};
