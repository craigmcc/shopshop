// @/app/(ss)/lists/[listId]/categories/[categoryId]/remoe/page.tsx

/**
 * Remove page for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { SubHeader } from "@/components/layout/SubHeader";
import { CategoryRemoveForm } from "@/components/categories/CategoryRemoveForm";
import { ServerResponse } from "@/components/shared/ServerResponse";
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

export default async function CategoryRemovePage(props: Props) {

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
  if (!member || (member.role !== MemberRole.ADMIN)) {
    return (
      <ServerResponse
        result="You are not an ADMIN of this List, so you cannot remove its Categories"
      />
    );
  }
  let category: Category | undefined = undefined;
  const foundCategory = await db.category.findFirst({
    where: {
      id: categoryId,
      listId: listId,
    }
  });
  if (foundCategory) {
    category = foundCategory;
  } else {
    return (
      <ServerResponse
        result="This Category does not exist"
      />
    );
  }

  return (
    <div>
      <SubHeader
        hrefBack={true}
        title={`Remove Category for List '${member.list.name}'`}
      />
      <CategoryRemoveForm
        category={category}
        list={member.list}
      />
    </div>
  )

}
