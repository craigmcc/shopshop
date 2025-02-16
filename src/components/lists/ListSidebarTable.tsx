"use client";

// @/components/lists/ListSidebarTable.tsx

/**
 * Table of available Lists for the ListSidebar.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Member, MemberRole } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
//import Link from "next/link";
//import { useState } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
  lists: List[],                        // Lists this Profile is a Member of
  members: Member[],                    // Memberships of Lists for this Profile
}

export function ListSidebarTable({ lists, members }: Props) {


  return (

    <div className={"mt-6 rounded-lg overflow-hidden border border-border"}>

      {members.length > 0 ? (
        <table className="w-full">
          <tbody>
          {lists.map((list) => (
            <tr key={list.id}>
              {isAdmin(list.id, members) ? (
                <td className="font-bold">{list.name}</td>
              ) : (
                <td>{list.name}</td>
              )}
              <td><MoreHorizontal className="h-r w-4"/></td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">No Lists found.</p>
        </div>
      )}
    </div>

  );

}

// Private Functions ---------------------------------------------------------

function isAdmin(listId: string, members: Member[]): boolean {
  const member = members.find((member) => member.listId === listId);
  if (member) {
    return member.role === MemberRole.ADMIN;
  }
  return false;
}
