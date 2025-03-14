// @/app/(ss)/lists/[listId]/categories/page.tsx

/**
 * Catalogs Table page for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResponse } from "@/components/shared/ServerResponse";
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
    return (
      <ServerResponse
        result="You are not an admin of this List, so you cannot view its Catalogs"
      />
    );
  }

  // Select the Categories for this List
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    // TODO - need pagination support
    skip: 0,
    take: 10,
    where: {
      listId: listId,
    },
  });

  return (
    <div>
      <SubHeader
        hrefAdd="/lists/[listId]/categories/new/settings"
        hrefBack="/lists"
        title={`Manage Categories for '${member.list.name}'`}
      />
      <CategoriesTable
        categories={categories}
        memberRole={member.role}
      />
    </div>
  )

}
