"use client";

// @/components/layout/SignedInMenu.tsx

/**
 * Dropdown menu for signed-in users.
 *
 * @packageDocumentation
 */

// External Module -----------------------------------------------------------

import { Profile } from "@prisma/client";
import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import { ProfileAvatar } from "@/components/profiles/ProfileAvatar";

// Public Objects ------------------------------------------------------------

type Props = {
  // Profile for which to create a menu
  profile: Profile;
}

export function SignedInMenu ({ profile }: Props){

  const CHOICES = [
    { title: "Edit Profile", href: "/profile" },
    { title: "Edit Lists", href: "/lists" },
    { title: "Sign Out", href: "/auth/signOut" },
  ];

  return (
    <div className="dropdown dropdown-end">
      <details>
        <summary className="btn btn-ghost w-32">
          <ProfileAvatar profile={profile} />
        </summary>
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
