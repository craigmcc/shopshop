// @/app/(ss)/lists/[listId]/settings/page.tsx

/**
 * Settings page for a List.
 *
 * @packageDocumentation
 */

 // External Modules ---------------------------------------------------------

import { List, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { SubHeader } from "@/components/layout/SubHeader";
import { ListSettingsForm } from "@/components/lists/ListSettingsForm";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID to be edited, or "new" for a new List
    listId: string,
  }>
}

export default async function ListSettingsPage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Look up an existing List (if requested)
  let list: List | undefined = undefined;
  if (listId !== "new") {
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
          result="You are not an admin of this List, so you cannot update it"
        />
      );
    } else {
      list = member.list;
    }
  }

  return (
    <div>
      <SubHeader
        hrefBack="/lists"
        title={list ? "Edit List Settings" : "Create New List"}
      />
      <ListSettingsForm list={list}/>
    </div>
  );

}
