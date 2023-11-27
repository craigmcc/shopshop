// @/components/lists/ListAvatar.tsx

/**
 * Avatar (either image or initials) for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import { List } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { initials } from "@/lib/Strings";
import { cn } from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ListAvatarProps {
  // Optional extra CSS classes to add
  className?: string;
  // List for which to create an avatar
  list: List;
  // List ID of the currently selected List
  listId: string;
}

export const ListAvatar = ({ className, list, listId }: ListAvatarProps) => {
  return (
    <div
      className={cn(
        "group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]",
        listId === list.id && "bg-orange/10 rounded-[16px] text-orange-500",
        className,
      )}
    >
      {list.imageUrl ? (
        <Image alt={`List '{list.name}'`} fill src={list.imageUrl} />
      ) : (
        <span className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background text-xs transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
          {initials(list.name)}
        </span>
      )}
    </div>
  );
};
