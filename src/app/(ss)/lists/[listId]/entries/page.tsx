// @/app/(ss)/lists/[listId]/entries/page.tsx

/**
 * Selected entries page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { ScrollText } from "lucide-react";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";
import { ItemWithCategory } from "@/lib/Types";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID for which entries are to be displayed
    listId: string,
  }>
}

export default async function ListEntriesPage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Check authorization (and List existence)
  const member = await db.member.findFirst({
    include: {
      list: true,
    },
    where: {
      listId: listId,
      profileId: profile.id,
    }
  });
  if (!member) {
    return (
      <ServerResponse
        result="You are not a member of this List, so you cannot manage its entries"
      />
    )
  }
  const list = member.list;

  // Load and sort the entries for this List
  const entries: ItemWithCategory[] = await db.item.findMany({
    include: {
      category: true,
    },
    where: {
      listId: listId,
      selected: true,
    },
  });
  entries.sort(sortEntries);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full p-2">
        <div>
          <ScrollText/>
        </div>
        <div className="font-semibold pl-2">{list.name}</div>
      </div>
      <div className="flex flex-col bg-base-100">
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              {entry.category.name}: {entry.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

}

// Private Objects -----------------------------------------------------------

function sortEntries(a: ItemWithCategory, b: ItemWithCategory): number {
  if (a.category.name < b.category.name) {
    return -1;
  } else if (a.category.name > b.category.name) {
    return 1;
  } else {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }
}
