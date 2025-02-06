// @/components/lists/ListsSidebar.tsx

/**
 * The Lists that the current user is a Member of, with controls to
 * select various actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List } from "@prisma/client";
import { SquarePlus} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

//import { ListSidebarTable } from "@/components/lists/ListSidebarTable";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

export async function ListsSidebar() {

  // Check sign in status
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }
  logger.info({
    context: "ListsSidebar.findProfile",
    profile: {
      ...profile,
      password: "*REDACTED*",
    },
  });

  // Select Lists this Profile is a Member of
  const members = await db.member.findMany({
    include: {
      list: true,
    },
    where: {
      profileId: profile.id,
    }
  });
  const lists: List[] = [];
  for (const member of members) {
    lists.push(member.list);
  }
  lists.sort( compareListNames )

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-centered justify-between w-full">
        <div>Shopping Lists</div>
        <div>
          <Link href="/lists/new/settings">
            <SquarePlus/>
          </Link>
        </div>
      </div>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>{list.name}</li>
        ))}
      </ul>
      <div>ListsSidebar End</div>
{/*
      <ListSidebarTable
        lists={lists}
        profile={profile}
      />
*/}
      </div>
    </>
  )

}

// Private Objects -----------------------------------------------------------

function compareListNames(a: List, b:List): number {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return +1;
  } else {
    return 0;
  }
}
