// @/app/(ss)/lists/[listId]/entries/page.tsx

/**
 * Selected entries page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

//import { ListEntriesForm } from "@/components/lists/ListEntriesForm";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
    params: Promise<{
        // List ID for which entries are to be displayed
        listId: string,
    }>
}

export default async function ListEntriesForm(props: Props) {

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

  return (
    <div>
      <h2>Selected Entries for List: {list.name}</h2>
      <p>Under construction...</p>
    </div>
  )

}
