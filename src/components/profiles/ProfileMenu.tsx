"use client";
// @/components/profiles/ProfileMenu.tsx

/**
 * Drop-down menu for a signed-in user.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { signOut } from "next-auth/react";
import { Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { Icons } from "@/components/shared/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ModalType, useModalStore } from "@/hooks/useModalStore";

// Public Objects ------------------------------------------------------------

interface ProfileMenuProps {
  // Profile of the signed-in user
  profile: Profile;
}

export const ProfileMenu = ({ profile }: ProfileMenuProps) => {
  const { onOpen } = useModalStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          <span className="px-2">{profile.name}</span>
          <Icons.Down className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 text-sm"
          onClick={() => onOpen(ModalType.PROFILE_UPDATE, { profile })}
        >
          Update Profile
          <Icons.User className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 text-sm"
          onClick={() => onOpen(ModalType.PROFILE_PASSWORD, { profile })}
        >
          Change Password
          <Icons.Password className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 text-sm text-rose-300"
          onClick={() => signOut()}
        >
          Sign Out
          <Icons.Leave className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
