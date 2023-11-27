"use client";
// @/hooks/useCurrentProfile.tsx

/**
 * Client side React hook to return the Profile of the currently signed in
 * user (if there is one)
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useSession } from "next-auth/react";
import { Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function useCurrentProfile(): Profile | null {
  const { data: session } = useSession();
  if (session) {
    return session.user.profile;
  } else {
    return null;
  }
}
