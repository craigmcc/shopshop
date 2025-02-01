"use server";

// @/actions/authActions.ts

/**
 * Utility methods to interact with AuthJS.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { AuthError } from "next-auth";
import { flattenValidationErrors } from "next-safe-action";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { hashPassword } from "@/lib/encryption";
import { logger } from "@/lib/ServerLogger";
import { type signInSchemaType } from "@/zod-schemas/signInSchema";
import { signUpSchema, type signUpSchemaType } from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

/**
 * Perform the AuthJS sign in action.
 *
 * @param formData                      Sign in form data
 *
 * @throws AuthError                    If the sign in fails
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
    if (error instanceof Error) {
      throw new AuthError(error.message);
    } else {
      throw new AuthError("Sign In failed");
    }
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

/**
 * Action to create a new Profile and store it in the database.
 */
export const saveSignUpAction = actionClient

  .metadata({ actionName: "saveSignUpAction" })

  .schema(signUpSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })

  .action(async ({
    parsedInput: profile
  }: { parsedInput: signUpSchemaType }) => {

    logger.info({
      context: "saveSignUpSchema.action",
      profile: {
        email: profile.email,
        name: profile.name,
        password: "*REDACTED*",
      }
    });

    const result = await db.profile.create({
      data: {
        email: profile.email,
        name: profile.name,
        password: hashPassword(profile.password),
      },
    });
    return { message: `Profile ID ${result.id} created successfully`}

  });
