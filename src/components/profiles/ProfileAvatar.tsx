// @/components/profiles/ProfileAvatar.tsx

/**
 * Avatar (either image or initials) for a Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import { Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { initials } from "@/lib/strings";
import { cn } from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ProfileAvatarProps {
  // Optional extra CSS classes to add
  className?: string;
  // Profile for which to create an avatar
  profile: Profile;
  // Profile ID of the currently selected Profile
  profileId: string;
}

export const ProfileAvatar = ({
  className,
  profile,
  profileId,
}: ProfileAvatarProps) => {
  return (
    <div
      className={cn(
        "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
        profileId === profile.id &&
          "bg-orange/10 rounded-[16px] text-orange-500",
        className,
      )}
    >
      {profile.imageUrl ? (
        <Image alt={`Profile '{profile.name}'`} fill src={profile.imageUrl} />
      ) : (
        <span className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
          {initials(profile.name)}
        </span>
      )}
    </div>
  );
};
