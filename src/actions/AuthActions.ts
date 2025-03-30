"use server";

// @/actions/authActions.ts

/**
 * Utility methods to interact with AuthJS, and to set up a new Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
//import { AuthError } from "next-auth";

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
export async function doSignInAction(formData: SignInSchemaType): Promise<ActionResult<Profile>> {

  try {
    logger.trace({
      context: "doSignInAction.input",
      email: formData.email,
      password: "*REDACTED*",
    })

    const response = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    logger.trace({
      context: "doSignInAction.output",
      response: response,
    });

    // Return a dummy profile object
    const profile: Profile = {
      createdAt: new Date(),
      email: formData.email,
      id: "",
      imageUrl: "",
      name: "",
      password: "*REDACTED*",
      updatedAt: new Date(),
    };
    return ({ model: profile });

  } catch (error) {

    logger.info({
      context: "doSignInAction.error",
      error: error,
      message: (error as Error).message,
    });
    return ({ message: (error as Error).message });

  }

}

/**
 * Perform the AuthJS sign out action.
 */
export async function doSignOutAction(): Promise<ActionResult<Profile>> {

  logger.trace({
    context: "doSignOutAction.input",
  });

  try {

    await signOut();
    logger.trace({
      context: "doSignOutAction.output",
    });
    return ({ message: "Success" });

  } catch (error) {

    return ({ message: (error as Error).message });

  }

}

