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
import { useEffect, useRef, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { useCurrentListContext } from "@/contexts/CurrentListContext";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

type Props = {
  // Lists this Profile is a Member of
  lists: List[],
  // Memberships of Lists for this Profile
  members: Member[],
}

export function ListSidebarTable({ lists, members }: Props) {

  const { currentList } = useCurrentListContext();
  logger.info({
    context: "ListSidebarTable.gettingCurrentList",
    currentList,
  })
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRefs.current.every(ref => ref && !ref.contains(event.target as Node))) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  return (

    <div className={"mt-4 rounded-lg border border-border"}>

      {members.length > 0 ? (
        <table className="w-full">
          <tbody>
          {lists.map((list, index) => (
            <tr key={index}>
              {isAdmin(list.id, members) ? (
                <td className="font-bold">
                  {(currentList && (currentList.id === list.id)) &&
                    <span className="font-bold text-accent pr-1">*</span>}
                  <Link href={`/lists/${list.id}/entries`}>{list.name}</Link>
                </td>
              ) : (
                <td>
                  {(currentList && (currentList.id === list.id)) &&
                    <span className="font-bold text-accent pr-1">*</span>}
                  <Link href={`/lists/${list.id}/entries`}>{list.name}</Link>
                </td>
              )}
              <td>
                <details
                  className="dropdown dropdown-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === list.id ? null : list.id);
                  }}
                  open={openDropdown === list.id}
                  ref={el => { dropdownRefs.current[index] = el; }}
                >
                  <summary className="btn btn-square btn-ghost tabIndex={0}">
                    <MoreHorizontal className="h-4 w-4"/>
                  </summary>
                  <ul
                    className="menu dropdown-content bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm"
                    tabIndex={0}
                  >
                    <li><Link href={`/lists/${list.id}/settings`}>Edit Settings</Link></li>
                    <li><Link href={`/lists/${list.id}/categories`}>Manage Categories</Link></li>
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
