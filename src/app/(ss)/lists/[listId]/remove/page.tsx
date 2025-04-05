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

import { SubHeader } from "@/components/layout/SubHeader";
import { ListRemoveForm } from "@/components/lists/ListRemoveForm";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
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
    const result: ActionResult<List> = {
      message: "You are not an ADMIN of this List, so you cannot remove it"
    }
    return (
      <ServerResult
        result={result}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <SubHeader
        hrefBack="/lists"
        title="Remove List"
      />
      <ListRemoveForm list={member.list}/>
    </div>
  )

}
