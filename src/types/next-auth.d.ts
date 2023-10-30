// @/types/next-auth.d.ts

/**
 * Override the type of the User object being returned in a session.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import NextAuth from "next-auth";

// Internal Modules ----------------------------------------------------------

import {Profile} from "@prisma/client";

// Public Types --------------------------------------------------------------

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession`, and received as a prop on the
     * `SessionProvider` React Context
     */
    interface Session {
        user: Profile;
    }
}
