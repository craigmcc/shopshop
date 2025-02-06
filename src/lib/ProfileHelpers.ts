// NOTE: *Not* a "use server" file to prevent methods from being server actions

// @/lib/profileHelpers.ts

/**
 * Helper functions for Profile models, NOT exposed as server actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/ServerLogger";

const isTest = process.env.NODE_ENV === "test";
let testProfile: Profile | null = null;

// Public Objects ------------------------------------------------------------

/**
 * TEST MODE: Returns the Profile (if any) recorded by a test.
 *
 * PRODUCTION MODE: If a user is currently signed in, look up and return the
 * Profile associated with that user's email address.  Otherwise, return null.
 */
export async function findProfile(): Promise<Profile | null> {

  // TEST MODE: Return the test Profile (if any)
  if (isTest) {
    if (testProfile) {
      return {
        ...testProfile,
        password: "*REDACTED*",
      }
    } else {
      return testProfile;
    }
  }

  // PRODUCTION MODE: Returned the signed in Profile (if any)
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      email: session.user.email,
    }
  });
  if (profile) {
    return {
      ...profile,
      password: "*REDACTED*",
    };
  } else {
    logger.error({
      context: "authActions.findProfile",
      message: `Session has email '${session.user.email}' but there is no matching profile`,
    });
    return null;
  }

}

/**
 * TEST MODE ONLY: Set the Profile to be returned by findProfile().
 */
export function setTestProfile(profile: Profile | null): void {
  if (isTest) {
    testProfile = profile;
  } else {
    throw new Error("Cannot call setTestProfile() outside of test mode");
  }
}
