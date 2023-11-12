"use client"
// @/components/profiles/ProfileMenu.tsx

/**
 * Drop-down menu for a signed-in user.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {signOut} from "next-auth/react";
import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {Icons} from "@/components/shared/Icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

interface ProfileMenuProps {
    // Profile of the signed-in user
    profile: Profile,
}

export const ProfileMenu = ({
    profile,
}: ProfileMenuProps) => {

    const {onOpen} = useModalStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button
                    className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    <span className="px-2">{profile.name}</span>
                    <Icons.Down className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen(ModalType.PROFILE_UPDATE, {profile})}
                >
                    Manage Profile
                    <Icons.User className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen(ModalType.PROFILE_PASSWORD, {profile})}
                >
                    Change Password
                    <Icons.Password className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <DropdownMenuItem
                    className="text-rose-300 px-3 py-2 text-sm cursor-pointer"
                    onClick={() => signOut()}
                >
                    Sign Out
                    <Icons.Leave className="h-4 w-4 ml-auto"/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}
