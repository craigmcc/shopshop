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

import { signIn } from "@/auth";
import { actionClient } from "@/lib/safe-action";
//import { logger } from "@/lib/ServerLogger";
import { signInSchema, signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

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

