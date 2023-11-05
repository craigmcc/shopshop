"use client"
// @/components/lists/ListSelectItem.tsx

/**
 * Navigation item to select a particular List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import {useParams, useRouter} from "next/navigation";
import {List} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {ActionTooltip} from "@/components/shared/ActionTooltip";
import {initials} from "@/lib/Strings";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ListItemProps {
    // The list being described by this ListItem.
    list: List;
}

export const ListSelectItem = ({
    list,
}: ListItemProps) => {

    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/lists/${list.id}`);
    }

    return (
        <ActionTooltip
            align="center"
            label={list.name}
            side="right"
        >
            <button
                className="group relative flex items-center justify-center"
                onClick={onClick}
            >
                <div className={cn(
                    "absolute left-0 bg-orange-500 rounded-r-full transition-all w-[4px]",
                    params?.listId !== list.id && "group-hover:h-[20px]",
                    params?.listId === list.id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.listId === list.id && "bg-orange/10 text-orange-500 rounded-[16px]"
                )}>
                    {list.imageUrl ? (
                        <Image
                            alt="List"
                            fill
                            src={list.imageUrl}
                        />
                    ) : (
                        <div className="flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                            {initials(list.name)}
                        </div>
                    )}
                </div>

            </button>
        </ActionTooltip>
    )

}
