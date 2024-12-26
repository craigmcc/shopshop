// @/actions/authActions.ts

"use server"

/**
 * Utility methods to interact with AuthJS.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { signIn, signOut } from "@/auth";
import { signInSchemaType } from "@/zod-schemas/signInSchema";
import {logger} from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

/**
 * Perform the AuthJS sign in action.
 *
 * @param formData                      Sign in form data
 */
export async function doSignIn(formData: signInSchemaType) {
  try {
    logger.info({
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
    logger.info({
      context: "doSignIn.error",
      error: error,
    })
    alert("Incorrect credentials");
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
