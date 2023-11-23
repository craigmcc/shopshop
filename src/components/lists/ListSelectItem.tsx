"use client";
// @/components/lists/ListSelectItem.tsx

/**
 * Navigation item to select a particular List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { List } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { ListAvatar } from "@/components/lists/ListAvatar";
import { ActionTooltip } from "@/components/shared/ActionTooltip";
import { cn } from "@/lib/utils";

// Public Objects ------------------------------------------------------------

interface ListItemProps {
  // The list being described by this ListItem.
  list: List;
}

export const ListSelectItem = ({ list }: ListItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/lists/${list.id}`);
  };

  return (
    <ActionTooltip align="center" label={list.name} side="right">
      <button
        className="group relative flex items-center justify-center"
        onClick={onClick}
      >
        <div
          className={cn(
            "absolute left-0 w-[4px] rounded-r-full bg-orange-500 transition-all",
            params?.listId !== list.id && "group-hover:h-[20px]",
            params?.listId === list.id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <ListAvatar list={list} listId={String(params?.listId)} />
      </button>
    </ActionTooltip>
  );
};
