// @/app/(ss)/lists/[listId]/categories/[categoryId]/items/[itemId]/settings/page.tsx

/**
 * Settings page for an Item.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Item } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ItemSettingsForm } from "@/components/items/ItemSettingsForm";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResponse } from "@/components/shared/ServerResponse";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
// import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // Category ID of the Category owning this Item
    categoryId: string,
    // Item ID to be edited
    itemId: string,
    // List ID of the List owning this Item
    listId: string,
  }>
}


export default async function ItemSettingsPage(props: Props) {

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
        result="You are not a Member of this List, so you cannot manage its Items"
      />
    );
  }

  // Select the Item to be edited
  let item: Item | undefined = undefined;
  if (itemId !== "new") {
    const foundItem = await db.item.findFirst({
      where: {
        id: itemId,
        categoryId: categoryId,
      }
    });
    if (foundItem) {
      item = foundItem;
    } else {
      return (
        <ServerResponse
          result="This Item does not exist"
        />
      );
    }
  }

  // Render the page
  return (
    <div className="flex flex-col">
      <SubHeader
        hrefBack={`/lists/${listId}/items?categoryId=${categoryId}`}
        title={(item ? "Edit Item" : "Create New Item") + ` for Category '${member.list.categories[0].name}'`}
      />
      <ItemSettingsForm
        category={member.list.categories[0]}
        item={item}
      />
    </div>
  );
}
