// @/components/profiles/ProfileAvatar.tsx

/**
 * Avatar (either image or initials) for a Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import Image from "next/image";

// Internal Modules ----------------------------------------------------------

import { initials } from "@/lib/Strings";

// Public Objects ------------------------------------------------------------

type Props = {
  // Profile for which to create an avatar
  profile: Profile;
}

export function ProfileAvatar({ profile }: Props) {

  return (
    <div className="group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]">
      {profile.imageUrl ? (
        <Image alt={`Profile '{profile.name}'`} fill src={profile.imageUrl} />
      ) : (
        <span className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-accent">
          <span className="text-accent-content">{initials(profile.name)}</span>
        </span>
      )}
    </div>
  );

}
