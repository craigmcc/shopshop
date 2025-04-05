// @/app/(ss)/lists/[listId]/categories/page.tsx

/**
 * Categories Table page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID for which to select Catalogs to be displayed
    listId: string,
  }>
}

export default async function CatalogsTablePage(props: Props) {

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
    const result: ActionResult<Category> = {
      message: "You are not a member of this List, so you cannot view its Categories",
    }
    return (
      <ServerResult
        result={result}
      />
    );
  }

  // Select the Categories for this List
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
/*
    skip: 0,
    take: 10,
*/
    where: {
      listId: listId,
    },
  });

  return (
    <div>
      <SubHeader
        hrefBack="/lists"
        title={`Manage Categories for '${member.list.name}'`}
      />
      <CategoriesTable
        categories={categories}
        list={member.list}
        memberRole={member.role}
      />
    </div>
  )

}
