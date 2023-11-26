"use client";
// @/components/lists/ListSidebarMember.tsx

/**
 * Individual Member for the members section of ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Member, MemberRole, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";
import { Icons } from "@/components/shared/Icons";

// Public Objects ------------------------------------------------------------

interface ListSidebarMemberProps {
  // The Member to be rendered
  member: Member & { profile: Profile };
  // The Profile of the signed in user
  profile: Profile;
}

const roleIconMap = {
  [MemberRole.GUEST]: <Icons.Guest className="h-4 w-4 text-indigo-500" />,
  [MemberRole.ADMIN]: <Icons.Admin className="h-4 w-4 text-rose-500" />,
};

export const ListSidebarMember = ({
  member,
  profile,
}: ListSidebarMemberProps) => {
  return (
    <div className="group mb-1 flex w-full items-center gap-x-2 rounded-md py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
      <ProfileAvatar profile={member.profile} profileId={String(profile?.id)} />
      <p className="text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300">
        {member.profile.name}
      </p>
      {roleIconMap[member.role]}
    </div>
  );
};
