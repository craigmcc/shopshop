// @/app/(ss)/lists/[listId]/remove/page.tsx

/**
 * Removal page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ListRemoveForm } from "@/components/lists/ListRemoveForm";
import { db } from "@/lib/db";
import { findProfile} from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID to be removed
    listId: string,
  }>
}

export default async function ListRemovePage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Check authorization
  let list: List | null = null;
  let message: string | null = null;
  const member = await db.member.findFirst({
    include: {
      list: true,
    },
    where: {
      listId: listId,
      profileId: profile.id,
    }
  });
  if (!member || !member.role || (member.role !== MemberRole.ADMIN)) {
    list = null;
    message = "You are not an admin of this List, so you cannot remove it"
  } else {
    list = member.list;
  }


  return (
    <>
      <h2>Remove List</h2>
      <ListRemoveForm list={list} message={message}/>
    </>
  )

}
