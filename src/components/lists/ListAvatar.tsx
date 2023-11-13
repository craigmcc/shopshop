// @/components/lists/ListAvatar.tsx

/**
 * Avatar (either image or initials) for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import {List} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {initials} from "@/lib/Strings";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ListAvatarProps {
    // Optional extra CSS classes to add
    className?: string,
    // List for which to create an avatar
    list: List,
    // List ID of the currently selected List
    listId: string,
}

export const ListAvatar = ({
                               className,
                               list,
                               listId,
                           }: ListAvatarProps) => {

    return (
        <div className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            listId === list.id && "bg-orange/10 text-orange-500 rounded-[16px]",
            className,
        )}>
            {list.imageUrl ? (
                <Image
                    alt={`List '{list.name}'`}
                    fill
                    src={list.imageUrl}
                />
            ) : (
                <span className="flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 text-xs">
                    {initials(list.name)}
                </span>
            )}
        </div>
    )


}
