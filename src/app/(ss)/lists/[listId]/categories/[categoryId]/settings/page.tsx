// @/app/(ss)/lists/[listId]/categories/[categoryId]/settings/page.tsx

/**
 * Settings page for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { CategorySettingsForm } from "@/components/categories/CategorySettingsForm";
import { SubHeader } from "@/components/layout/SubHeader";
import { ServerResult } from "@/components/shared/ServerResult";
import { ActionResult } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
//import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  params: Promise<{
    // Category ID to be edited
    categoryId: string,
    // List ID of the List owning this Category
    listId: string,
  }>
}

export default async function CategorySettingsPage(props: Props) {

  const params = await props.params;
  const categoryId = params.categoryId;
  const listId = params.listId;

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    redirect("/auth/signIn");
  }

  // Check authorization (and Category existence)
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
      message: "You are not a Member of this List, so you cannot manage its Categories"
    }
    return (
      <ServerResult
        result={result}
      />
    );
  }
  let category: Category | undefined = undefined;
  if (categoryId !== "new") {
    const foundCategory = await db.category.findFirst({
      where: {
        id: categoryId,
        listId: listId,
      }
    });
    if (foundCategory) {
      category = foundCategory;
    } else {
      const result: ActionResult<Category> = {
        message: "This Category does not exist",
      }
      return (
        <ServerResult
          result={result}
        />
      );
    }
  }

  return (
    <div>
      <SubHeader
        hrefBack={true}
        title={category ? "Edit Category" : "Create New Category"}
      />
      <CategorySettingsForm
        category={category}
        list={member.list}
      />
    </div>
  )

}
