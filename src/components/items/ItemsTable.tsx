"use client";

// @components/items/ItemsTable.tsx

/**
 * Table of available Items for a Category.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
  // Category that owns this Item
  category: Category,
  // Items for this Category
  items: Item[],
}

export function ItemsTable({ category, items }: Props) {

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
    <div className={"card bg-base-300 shadow-xl"}>
      <table className="mt-4 rounded-lg border border-border">
        <thead>
        <tr>
          <th className="font-bold">Name</th>
          <th className="text-right">Actions</th>
        </tr>
        </thead>
        <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="p-2">
              {item.name}
            </td>
            <td className="p-2 text-right">
              <details
                className="dropdown dropdown-end"
                open={openDropdown === item.id}
                ref={el => { dropdownRefs.current[index] = el; }}
              >
                <summary
                  className="btn btn-ghost btn-circle"
                  onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </summary>
                <ul className="menu dropdown-content mt-2 w-52 rounded-lg bg-base-100 p-2 shadow">
                  <li>
                    <Link
                      className="flex items-center"
                      href={`/lists/${category.listId}/categories/${category.id}/items/${item.id}/settings`}
                    >
                      Edit Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center"
                      href={`/lists/${category.listId}/categories/${category.id}/items/${item.id}/remove`}
                    >
                      Remove Item
                    </Link>
                  </li>
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
