"use client";

// @/components/categories/CategoriesTable.tsx

/**
 * Table of available Categories for a List.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, List, MemberRole } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ClientLogger";
import { useCurrentListContext } from "@/contexts/CurrentListContext";

// Public Objects ------------------------------------------------------------

type Props = {
  // Categories for this List
  categories: Category[],
  // List that owns these Categories
  list: List,
  // Current Profile's MemberRole for this List
  memberRole: MemberRole,
}

export function CategoriesTable({ categories, list, memberRole }: Props) {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  logger.info({
    context: "CategoriesTable.settingCurrentList",
    list,
  })
  const { setCurrentList } = useCurrentListContext();
  setCurrentList(list);

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
    <div className={"card bg-base-300 shadow-xl"}>
      <table className="mt-4 rounded-lg border border-border">
        <thead>
        <tr>
          <th className="font-bold">Name</th>
          <th className="text-right">Actions</th>
        </tr>
        </thead>
        <tbody>
        {categories.map((category, index) => (
          <tr key={index}>
            <td>
              {category.name}
            </td>
            <td className="text-right">
              <details
                className="dropdown dropdown-end"
                open={openDropdown === category.id}
                onClick={() => {
                  setOpenDropdown(openDropdown === category.id ? null : category.id);
                }}
                ref={el => { dropdownRefs.current[index] = el; }}
              >
                <summary className="btn btn-ghost btn-circle">
                  <MoreHorizontal />
                </summary>
                <ul className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link href={`/lists/${category.listId}/categories/${category.id}/settings`}>
                      Edit Settings
                    </Link>
                  </li>
                  <li>
                    <Link href={`/lists/${category.listId}/categories/${category.id}/items`}>
                      Manage Items
                    </Link>
                  </li>
                  {(memberRole === MemberRole.ADMIN) && (
                    <li>
                      <Link href={`/lists/${category.listId}/categories/${category.id}/remove`}>
                        Remove Category
                      </Link>
                    </li>
                  )}
                </ul>
              </details>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )

}
