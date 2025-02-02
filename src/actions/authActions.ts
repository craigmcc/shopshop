"use server";

// @/actions/authActions.ts

/**
 * Utility methods to interact with AuthJS, and to set up a new Profile.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma, Profile } from "@prisma/client";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { signIn, signOut } from "@/auth";
import { UniqueConstraintViolation, ValidationViolation } from "@/errors/DatabaseErrors";
import { db } from "@/lib/db";
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
export async function doSignInAction(formData: signInSchemaType) {
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
export async function doSignOutAction() {
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
 *
 * @param formData                      Sign up form data
 *
 * @returns                             The new Profile on success
 *
 * @throws UniqueConstraintError        If the email address is already in use
 * @throws ValidationViolation          If the data is invalid per the schema
 */
export async function doSignUpAction(formData: signUpSchemaType): Promise<Profile> {

  logger.info({
    context: "doSignUpAction.input",
    formData: {
      ...formData,
      confirmPassword: "*REDACTED*",
      password: "*REDACTED*",
    }
  });

  // Rerun the validation to ensure that the data is still valid.
  try {
    signUpSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationViolation(error);
    } else {

    }
  }

  // Attempt to create the new Profile in the database.
  try {
    const result = await db.profile.create({
      data: {
        email: formData.email,
        name: formData.name,
        password: await hashPassword(formData.password),
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new UniqueConstraintViolation(`Email '${formData.email}' is already in use`);
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }

}
