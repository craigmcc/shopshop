"use client"
// @/components/lists/ListSidebarHeader.tsx

/**
 * Header for the ListSidebar component.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {MemberRole, Profile} from "@prisma/client";
import {ListWithMembersWithProfiles} from "@/types/types";

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

interface ListSidebarHeaderProps {
    list: ListWithMembersWithProfiles;
    profile: Profile,
    role?: MemberRole;
}

export const ListSidebarHeader = ({
    list,
    profile,
    role
} : ListSidebarHeaderProps) => {

    const isAdmin = role === MemberRole.ADMIN;
    const {onOpen} = useModalStore();

    return (
       <DropdownMenu>
           <DropdownMenuTrigger
               className="focus:outline-none"
               asChild
           >
               <button
                   className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
               >
                   {list.name}
                   <Icons.Down className="h-5 w-5 ml-auto"/>
               </button>
           </DropdownMenuTrigger>
           <DropdownMenuContent
               className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
           >
               {isAdmin && (
                   <DropdownMenuItem
                       className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                       onClick={() => onOpen(ModalType.LIST_INVITE, {list, profile})}
                   >
                       Invite People
                       <Icons.UserPlus className="h-4 w-4 ml-auto"/>
                   </DropdownMenuItem>
               )}
               {isAdmin && (
                   <DropdownMenuItem
                       className="px-3 py-2 text-sm cursor-pointer"
                       onClick={() => onOpen(ModalType.LIST_FORM, {list, profile})}
                   >
                       List Settings
                       <Icons.Settings className="h-4 w-4 ml-auto"/>
                   </DropdownMenuItem>
               )}
               {isAdmin && (
                   <DropdownMenuItem
                       onClick={() => onOpen(ModalType.LIST_MEMBERS, {list, profile})}
                       className="px-3 py-2 text-sm cursor-pointer"
                   >
                       Manage Members
                       <Icons.Users className="h-4 w-4 ml-auto" />
                   </DropdownMenuItem>
               )}
               {isAdmin && (
                   <DropdownMenuItem
                       onClick={() => onOpen(ModalType.LIST_REMOVE, {list, profile})}
                       className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                   >
                       Remove List
                       <Icons.Remove className="h-4 w-4 ml-auto" />
                   </DropdownMenuItem>
               )}
               {isAdmin && (
                   <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
               )}
               <DropdownMenuItem
                   onClick={() => onOpen(ModalType.LIST_LEAVE, {list, profile})}
                   className="text-rose-300 px-3 py-2 text-sm cursor-pointer"
               >
                   Leave List
                   <Icons.Leave className="h-4 w-4 ml-auto" />
               </DropdownMenuItem>
           </DropdownMenuContent>
       </DropdownMenu>
    )

}
