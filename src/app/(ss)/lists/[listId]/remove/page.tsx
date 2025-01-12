// @/app/(ss)/lists/[listId]/remove/page.tsx

/**
 * Page for removing a List model.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { findProfile } from "@/actions/authActions";
import { ListRemoveForm } from "@/components/lists/ListRemoveForm";
import {
  Card,
  CardContent,
//  CardDescription,
//  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/db";
import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

interface Props {
  params: Promise<{
    listId: string,
  }>
}

export default async function ListRemovePage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check sign in status
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }
  logger.info({
    context: "ListRemovePage",
    listId: listId,
    profile: profile,
  });

  // Check admin status of the signed in Profile for this List
  const member = await db.member.findFirst({
    include: {
      list: true,
    },
    where: {
      profileId: profile.id,
      listId: listId,
      role: "ADMIN",
    }
  });
  let message: string | undefined = undefined;
  if (member === null) {
    message = "You are not an admin of this List, so you cannot remove it";
    redirect("/lists"); // TODO - need to be able to pass this on
  }

  return (
    <Card className="items-center justify-center">

      <CardHeader>
        <CardTitle>Remove List {member.list.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <ListRemoveForm
          listId={listId}
          message={message}
          profile={profile}
        />
      </CardContent>

    </Card>
  )

}
