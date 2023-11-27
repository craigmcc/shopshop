// @/app/(main)/lists/[listId]/layout.tsx

/**
 * Layout for List related pages.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import { ListSidebar } from "@/components/lists/ListSidebar";
import { currentProfile } from "@/lib/currentProfile";

// Public Objects ------------------------------------------------------------

interface ListIdLayoutProps {
  children: React.ReactNode;
  params: { listId: string };
}

const ListIdLayout = async ({ children, params }: ListIdLayoutProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const list = await ListActions.findMembers(params.listId);
  if (!list) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed hidden h-full w-60 flex-col md:flex">
        <ListSidebar list={list} profile={profile} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ListIdLayout;
