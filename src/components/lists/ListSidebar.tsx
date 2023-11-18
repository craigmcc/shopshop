// @/components/lists/ListSidebar.tsx

/**
 * Sidebar menu for ListsIdPage.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {ListSidebarHeader} from"@/components/lists/ListSidebarHeader";
import {ListSidebarMember} from "@/components/lists/ListSidebarMember";
import {ListSidebarSection} from "@/components/lists/ListSidebarSection";
import {ListWithMembersWithProfiles} from "@/types/types";

// Public Objects ------------------------------------------------------------

interface ListSidebarProps {
    list: ListWithMembersWithProfiles;
    profile: Profile;
}

export const ListSidebar = async ({list, profile}: ListSidebarProps) => {

    const role = list.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <aside className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5] py-3">
            <ListSidebarHeader
                list={list}
                profile={profile}
                role={role}
            />
            {!!list.members?.length && (
                <>
                <div className="mb-2 px-4">
                    <ListSidebarSection
                        label="Members"
                        list={list}
                        profile={profile}
                        role={role}
                        sectionType="members"
                    />
                    {list.members.map((member) => (
                        <ListSidebarMember
                            key={member.id}
                            member={member}
                            profile={profile}
                        />
                    ))}
                </div>
                </>
            )}
        </aside>
    )

};
