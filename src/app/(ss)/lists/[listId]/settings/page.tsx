// @/app/(ss)/lists/[listId]/settings/page.tsx

/**
 * Page for creating or editing List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { findProfile } from "@/actions/authActions";
import ListForm from "@/components/lists/ListForm";
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

export default async function ListSettingsPage(props: Props) {

  const params = await props.params;
  const listId = params.listId;

  // Check sign in status
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }
  logger.trace({
    context: "ListSettingsPage",
    listId: listId,
    profile: profile,
  });

  // Create an empty List (if creating) or look up an existing List (if editing)
  let list: List | null;
  if (listId === "new") {
    list = {
      id: "",
      imageUrl: "",
      name: "",
      profileId: profile.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  } else {
    list = await db.list.findUnique({
      where: {
        id: listId,
        profileId: profile.id,
      }
    })
  }

  // If no List was found, display an error and return to "/lists" page
  if (!list) {
    // TODO - error message
    redirect("/lists");
  }

  return (
    <Card className="items-center justify-center">

      <CardHeader>
        <CardTitle>{list.id ? "Edit Existing List" : "Create New List"}</CardTitle>
      </CardHeader>

      <CardContent>
        <ListForm
          list={list}
          profile={profile}
        />
      </CardContent>

    </Card>
  )
}
