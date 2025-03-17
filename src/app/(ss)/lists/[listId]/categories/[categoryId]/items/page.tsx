// @/app/(ss)/lists/[listId]/categories/[categoryId]/items/page.tsx

/**
 * Items Table page for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ItemsTable } from "@/components/items/ItemsTable";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
// import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID for which to select Items to be displayed
    listId: string,
    // Category ID for which to select Items to be displayed
    categoryId: string,
  }>
}

export default async function ItemsTablePage(props: Props) {

  const params = await props.params;
  const categoryId = params.categoryId;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Check authorization (and List and Catalog existence)
  const member = await db.member.findFirst({
    include: {
      list: {
        include: {
          categories: {
            where: {
              id: categoryId,
            },
          },
        },
      },
    },
    where: {
      listId: listId,
      profileId: profile.id,
    }
  });
  if (!member) {
    return (
      <ServerResponse
        result="You are not a Member of this List, so you cannot manage its Items"
      />
    );
  }

  // Select the Items for this Category
  const items = await db.item.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      categoryId: categoryId,
    },
  });

  return (
    <div>
      <SubHeader
        hrefAdd={`/lists/${member.list.id}/categories/${member.list.categories[0].id}/items/new/settings`}
        hrefBack={`/lists/${member.list.id}/categories`}
        title={`Manage Items for '${member.list.categories[0].name}'`}
      />
      <ItemsTable
        items={items}
        memberRole={member.role}
      />
    </div>
  )

}
