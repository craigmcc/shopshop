// @/app/(ss)/lists/[listId]/categories/[categoryId]/items/[itemId]/remove/page.tsx

/**
 * Remove page for an Item.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ItemRemoveForm } from "@/components/items/ItemRemoveForm";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
// import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // Category ID for which to select Item to be removed
    categoryId: string,
    // Item ID to be removed
    itemId: string,
    // List ID for which to select Item to be removed
    listId: string,
  }>
}

export default async function ItemRemovePage(props: Props) {

  const params = await props.params;
  const categoryId = params.categoryId;
  const itemId = params.itemId;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Check authorization (and List and Category existence)
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
        result="You are not a Member of this List, so you cannot remove its Items"
      />
    );
  }

  // Select the Item for this Category
  const item = await db.item.findFirst({
    where: {
      id: itemId,
      categoryId: categoryId,
    }
  });
  if (!item) {
    return (
      <ServerResponse
        result="That Item does not exist"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <SubHeader
        hrefBack={`/lists/${member.list.id}/items?categoryId=${categoryId}`}
        title={`Remove Item for Category '${member.list.categories[0].name}'`}
      />
      <ItemRemoveForm
        category={member.list.categories[0]}
        item={item}
      />
    </div>
  );
}

