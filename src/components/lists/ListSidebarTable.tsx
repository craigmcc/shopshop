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
import Link from "next/link";
//import { useState } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
  // Lists this Profile is a Member of
  lists: List[],
  // Memberships of Lists for this Profile
  members: Member[],
}

export function ListSidebarTable({ lists, members }: Props) {


  return (

    <div className={"mt-4 rounded-lg border border-border"}>

      {members.length > 0 ? (
        <table className="w-full">
          <tbody>
          {lists.map((list, index) => (
            <tr key={index}>
              {isAdmin(list.id, members) ? (
                <td className="font-bold">{list.name}</td>
              ) : (
                <td>{list.name}</td>
              )}
              <td>
                <details className="dropdown dropdown-center">
                  <summary className="btn btn-square btn-ghost">
                    <MoreHorizontal className="h-4 w-4"/>
                  </summary>
                  <ul
                    className="menu dropdown-content bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm"
                    tabIndex={0}
                  >
                    <li><Link href={`/lists/${list.id}/settings`}>Edit Settings</Link></li>
                    <li><Link href={`/lists/${list.id}/remove`}>Remove List</Link></li>
                  </ul>
                </details>
              </td>
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
