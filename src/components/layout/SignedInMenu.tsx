"use client";

// @/components/layout/SignedInMenu.tsx

/**
 * Dropdown menu for signed-in users.
 *
 * @packageDocumentation
 */

// External Module -----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const SignedInMenu = () => {

  const CHOICES = [
    { title: "Edit Profile", href: "/profile" },
    { title: "Sign Out", href: "/signOut" },
  ];


  return (
    <div className="dropdown dropdown-end">
      <details>
        <summary>User Options</summary>
        <ul tabIndex={0} className="menu dropdown-content z-[1] mt-6 shadow bg-base-300 rounded-box mt-2">
          {CHOICES.map((CHOICE) => (
            <Link
              href={CHOICE.href}
              key={CHOICE.title}
            >
              {CHOICE.title}
            </Link>
          ))}
        </ul>
      </details>
    </div>
  );
}
