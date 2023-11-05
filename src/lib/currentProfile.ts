// @/lib/currentProfile.ts

/**
 * Server side function to look up and return the Profile of the currently
 * signed in user (if there is one).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth";
import {Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {authOptions} from "@/app/api/auth/[...nextauth]/route";

// Public Objects ------------------------------------------------------------

export const currentProfile = async (): Promise<Profile | null> => {
    const session = await getServerSession(authOptions);
    if (session) {
        return session.user.profile;
    } else {
        return null;
    }
}
