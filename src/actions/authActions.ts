// @/actions/authActions.ts

"use server"

/**
 * Utility methods to interact with AuthJS.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/ServerLogger";
import { signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

/**
 * Perform the AuthJS sign in action.
 *
 * @param formData                      Sign in form data
 */
export async function doSignIn(formData: signInSchemaType) {
  try {
    logger.trace({
      context: "doSignIn.input",
      email: formData.email,
      password: "*REDACTED*",
    })
    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    logger.info({
      context: "doSignIn.output",
      response: response,
    });
    return response;
  } catch (error) {
    logger.error({
      context: "doSignIn.error",
      error: error,
    });
    throw error;
  }
}

/**
 * Perform the AuthJS sign out action.
 */
export async function doSignOut() {
  logger.info({
    context: "doSignOut.input",
  });
  await signOut();
}

/**
 * If a user is currently signed in, look up and return the Profile associated
 * with that user's email address.  Otherwise, return null.
 */
export async function findProfile(): Promise<Profile | null> {

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
