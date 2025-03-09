"use server";

// @/actions/authActions.ts

/**
 * Utility methods to interact with AuthJS, and to set up a new Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { AuthError } from "next-auth";

// Internal Modules ----------------------------------------------------------

import { signIn, signOut } from "@/auth";
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
    logger.info({
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
export async function doSignOutAction() {
  logger.trace({
    context: "doSignOut.input",
  });
  await signOut();
}
