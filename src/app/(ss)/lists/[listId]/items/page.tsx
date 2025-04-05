// @/app/(ss)/lists/[listId]/categories/[categoryId]/items/page.tsx

/**
 * Items Table page for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { ItemsTable } from "@/components/items/ItemsTable";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
import {SelectOption} from "@/types/types";
// import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // List ID for which to select Items to be displayed
    listId: string,
  }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
}

export default async function ItemsTablePage(props: Props) {

  const params = await props.params;
  const listId = params.listId;
  const searchParams = await props.searchParams;
  const proposedCategoryId = searchParams.categoryId;

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
            orderBy: {
              name: "asc",
            }
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
    const result: ActionResult<Item> = {
      message: "You are not a Member of this List, so you cannot manage its Items"
    }
    return (
      <ServerResult
        result={result}
      />
    );
  }

  // Calculate the ptions for selecting a Category
  const categoryOptions: SelectOption[] = [];
  categoryOptions.push({ label: "Select a Category", value: "" });
  for (const category of member.list.categories) {
    categoryOptions.push({
      label: category.name,
      value: category.id,
    });
  }

  // Remember the selected category (if any)
  let selectedCategory: Category | undefined;
  if (proposedCategoryId) {
    selectedCategory = member.list.categories.find((category) => category.id === proposedCategoryId);
  }

  // Select the Items for the selected Category (if any)
  let selectedItems: Item[] = [];
  if (selectedCategory) {
    selectedItems = await db.item.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        categoryId: selectedCategory.id,
      },
    })
  }

  return (
    <div>
      <SubHeader
        hrefBack={`/lists`}
        title={`Manage Items for List '${member.list.name}'`}
      />
      <ItemsTable
        category={selectedCategory}
        categoryOptions={categoryOptions}
        items={selectedItems}
        list={member.list}
        memberRole={member.role}
      />
    </div>
  )

}
