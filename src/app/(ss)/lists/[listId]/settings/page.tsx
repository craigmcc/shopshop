// @/app/(ss)/lists/[listId]/settings/page.tsx

/**
 * Settings page for a List.
 *
 * @packageDocumentation
 */

 // External Modules ---------------------------------------------------------

import { List } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ListForm } from "@/components/lists/ListForm";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    listId: string,
  }>
}

export default async function ListSettingsPage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check sign in status
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Look up an existing List (if requested)
  let list: List | undefined = undefined;
  if (listId !== "new") {
    // @ts-expect-error Leave list undefined if listId is "new"
    list = await db.list.findUnique({
      where: {
        id: listId,
      }
    });
  }

  return (
    <div>
      <ListForm list={list} profile={profile} />
    </div>
  );

}
