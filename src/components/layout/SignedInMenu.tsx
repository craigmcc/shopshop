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
    { title: "Sign Out", href: "/auth/signOut" },
  ];


  return (
    <div className="dropdown dropdown-end">
      <details>
        <summary className="btn btn-ghost">User Options</summary>
        <ul className="menu dropdown-content z-1 mt-6 shadow-sm bg-base-300 rounded-box" tabIndex={0}>
          {CHOICES.map((CHOICE) => (
            <li key={CHOICE.title}>
              <Link
                href={CHOICE.href}
                key={CHOICE.title}
              >
                {CHOICE.title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
