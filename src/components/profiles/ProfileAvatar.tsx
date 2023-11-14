// @/components/Profiles/ProfileAvatar.tsx

/**
 * Avatar (either image or initials) for a Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {initials} from "@/lib/Strings";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ProfileAvatarProps {
    // Optional extra CSS classes to add
    className?: string,
    // Profile for which to create an avatar
    profile: Profile,
    // Profile ID of the currently selected Profile
    profileId: string,
}

export const ProfileAvatar = ({
                               className,
                               profile,
                               profileId,
                           }: ProfileAvatarProps) => {

    return (
        <div className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            profileId === profile.id && "bg-orange/10 text-orange-500 rounded-[16px]",
            className,
        )}>
            {profile.imageUrl ? (
                <Image
                    alt={`Profile '{profile.name}'`}
                    fill
                    src={profile.imageUrl}
                />
            ) : (
                <span className="flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 text-xs">
                    {initials(profile.name)}
                </span>
            )}
        </div>
    )


}
