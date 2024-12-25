// @/actions/saveSignInAction.ts

"use server"

/**
 * Authenticate the user signing in.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { flattenValidationErrors } from "next-safe-action";

// Internal Modules ----------------------------------------------------------

import { signIn, signOut } from "@/auth";
import { actionClient } from "@/lib/safe-action";
//import { logger } from "@/lib/ServerLogger";
import { signInSchema, signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

export async function doSignIn(formData: signInSchemaType) {
  const response = await signIn("credentials", {
    email: formData.email,
    password: formData.password,
    redirect: false,
  });
  return response;
}

export async function doSignOut() {
  await signOut({ redirectTo: "/" });
}

export const saveSignInAction = actionClient

  .metadata({ actionName: "saveSignInAction"})

  .schema(signInSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })

  .action(async ({

    // Validate the incoming data
      parsedInput: formData
    }: { parsedInput: signInSchemaType }) => {

    await signIn("credentials", formData);

    return { message: `User ${formData.email} signed in successfully`}

  });

