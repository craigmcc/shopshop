// @/app/(ss)/lists/[listId]/remove/page.tsx

/**
 * Removal page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ListRemoveForm } from "@/components/lists/ListRemoveForm";
import { ServerResponse } from "@/components/shared/ServerResponse";
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
  if (!member || (member.role !== MemberRole.ADMIN)) {
    return (
      <ServerResponse
        result="You are not an admin of this List, so you cannot remove it"
      />
    );
  }

  return (
    <ListRemoveForm list={member.list}/>
  )

}
