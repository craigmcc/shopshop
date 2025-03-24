"use server";

// @/actions/authActions.ts

/**
 * Utility methods to interact with AuthJS, and to set up a new Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { AuthError } from "next-auth";

// Internal Modules ----------------------------------------------------------

import { signIn, signOut } from "@/auth";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ServerLogger";
import{ type SignInSchemaType } from "@/zod-schemas/SignInSchema";

// Public Objects ------------------------------------------------------------

/**
 * Perform the AuthJS sign in action.
 *
 * @param formData                      Sign in form data
 *
 * @throws AuthError                    If the sign in fails
 */
export async function doSignInAction(formData: SignInSchemaType) {
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
    logger.trace({
      context: "doSignIn.output",
      response: response,
    });
    return response;
  } catch (error) {
    logger.trace({
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
export async function doSignOutAction(): Promise<ActionResult<Profile>> {

  logger.trace({
    context: "doSignOut.input",
  });

  try {
    await signOut();
    logger.trace({
      context: "doSignOut.output",
    });
    return ({ message: "Success" });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

