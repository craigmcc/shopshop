// @/app/(main)/lists/[listId]/page.tsx

/**
 * Main page for a specified List ID.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as CategoryActions from "@/actions/CategoryActions";
import * as ListActions from "@/actions/ListActions";
import { ListIdPageContent } from "@/components/lists/ListIdPageContent";
import { NotAuthorized } from "@/components/shared/NotAuthorized";
import { NotSignedIn } from "@/components/shared/NotSignedIn";
import { currentProfile } from "@/lib/currentProfile";

// Public Objects ------------------------------------------------------------

interface ListIdPageProps {
  params: {
    listId: string;
  };
}

const ListIdPage = async ({ params }: ListIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return <NotSignedIn />;
  }

  const list = await ListActions.member(profile.id, params.listId);
  if (!list) {
    return (
      <NotAuthorized message="You are not a Member of the specified List" />
    );
  }

  const categories = await CategoryActions.all(params.listId);

  return <ListIdPageContent categories={categories} list={list} />;
};

export default ListIdPage;
