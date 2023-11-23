"use client";
// @/components/lists/ListSidebarHeader.tsx

/**
 * Header for the ListSidebar component.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { MemberRole, Profile } from "@prisma/client";
import { ListWithMembersWithProfiles } from "@/types/types";

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

interface ListSidebarHeaderProps {
  list: ListWithMembersWithProfiles;
  profile: Profile;
  role?: MemberRole;
}

export const ListSidebarHeader = ({
  list,
  profile,
  role,
}: ListSidebarHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const { onOpen } = useModalStore();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {list.name}
          <Icons.Down className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        <DropdownMenuItem
          className="cursor-pointer px-3 py-2 text-sm text-yellow-600 dark:text-yellow-400"
          onClick={() => router.push(`/lists/${list.id}`)}
        >
          Current Contents
          <Icons.List className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
            onClick={() => onOpen(ModalType.LIST_INVITE, { list, profile })}
          >
            Invite People
            <Icons.UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm"
            onClick={() => onOpen(ModalType.LIST_FORM, { list, profile })}
          >
            List Settings
            <Icons.Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="cursor-pointer px-3 py-2 text-sm"
            onClick={() => router.push(`/lists/${list.id}/categories`)}
          >
            Categories and Items
            <Icons.Categories className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen(ModalType.LIST_MEMBERS, { list, profile })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Manage Members
            <Icons.Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen(ModalType.LIST_REMOVE, { list, profile })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-500"
          >
            Remove List
            <Icons.Remove className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        )}
        <DropdownMenuItem
          onClick={() => onOpen(ModalType.LIST_LEAVE, { list, profile })}
          className="cursor-pointer px-3 py-2 text-sm text-rose-300"
        >
          Leave List
          <Icons.Leave className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
