// @/actions/saveSignUpAction.ts

"use server"

/**
 * Save the data from SignUpForm as a new Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { flattenValidationErrors} from "next-safe-action";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { hashPassword } from "@/lib/encryption";
import { logger } from "@/lib/ServerLogger";
import { signUpSchema, signUpSchemaType } from "@/zod-schemas/signUpSchema";

// Public Objects ------------------------------------------------------------

export const saveSignUpAction = actionClient

  .metadata({ actionName: "saveSignUpAction"})

  .schema(signUpSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })

  .action(async ({

    // Validate the incoming data
    parsedInput: profile
  }: { parsedInput: signUpSchemaType }) => {

    // No authentication is required - this is a new Profile being created

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
        password: await hashPassword(profile.password),
      },
    });
    return { message: `Profile ID #${result.id} created successfully`}

  });
