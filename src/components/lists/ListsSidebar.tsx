// @/components/lists/ListsSidebar.tsx

/**
 * The lists that the current user is a member of, with controls to select actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Member, Prisma, Profile } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

export async function ListsSidebar() {

  // Check sign in status
  const session = await auth();
  logger.info({
    context: "ListsLayout",
    session: session,
  });
  if (!session) {
    redirect("/auth/signIn");
  }

  // Select the Profile and associated Lists this Profile is a Member of
  const profile = await db.profile.findUnique({
    include: {
      members: {
        include: {
          list: true,
        }
      }
    },
/*
    omit: {
      password: true,
    },
*/
    where: {
      email: session.user.email!,
    }
  });
  logger.info({
    context: "ListsSidebar.find",
    profile: profile,
  });

  return (
    <span>ListsSidebar</span>
  )

}
