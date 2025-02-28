"use server";

// @/actions/ProfileActions.ts

/**
 * Actions for Profile models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

import { ActionResult, ValidationActionResult, ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { hashPassword} from "@/lib/Encryption";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ProfileCreateSchema,
  type ProfileCreateSchemaType,
  ProfileUpdateSchema,
  type ProfileUpdateSchemaType,
} from "@/zod-schemas/ProfileSchema";
import {
  SignUpSchema,
  type SignUpSchemaType,
} from "@/zod-schemas/SignUpSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a Profile.
 *
 * @param data                          Parameters for creating a Profile
 *
 * @returns                             Newly created Profile or error message
 */
export async function createProfile(data: ProfileCreateSchemaType): Promise<ActionResult<Profile>> {

  // Check authentication
  // Not needed - signing up is open to all

  // Check authorization
  // Not needed - signing up is open to all

  // Check data validity
  try {
    ProfileCreateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Check for uniqueness constraint violation
  const existing = await db.profile.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existing) {
    return ({ message: "That email address is already in use" });
  }

  try {
    // Create and return the new Profile
    const created = await db.profile.create({
      data: {
        email: data.email,
        // TODO - imageUrl when supported
        name: data.name,
        password: hashPassword(data.password),
      }
    });
    logger.trace({
      context: "ProfileActions.createProfile",
      message: "Profile created",
      profile: {
        ...created,
        password: "*REDACTED*",
      },
    });
    return ({ model: created });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to remove a Profile.
 *
 * @param profileId                     ID of the Profile to be removed
 *
 * @returns                             Removed Profile or error message
 */
export async function removeProfile(profileId: IdSchemaType): Promise<ActionResult<Profile>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  if (profile.id !== profileId) {
    return ({ message: "You can only remove your own Profile" });
  }

  // Check data validity
  try {
    IdSchema.parse(profileId);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Remove and return the Profile
  try {
    const removed = await db.profile.delete({
      where: {
        id: profileId,
      }
    });
    if (!removed) {
      return ({ message: "That Profile does not exist" });
    }
    logger.trace({
      context: "ProfileActions.removeProfile",
      profile: {
        ...removed,
        password: "*REDACTED*",
      }
    });
    return ({ model: removed });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to create a Profile from SignUpForm.
 *
 * @param data                          Parameters for creating a Profile
 *
 * @returns                             Newly created Profile or error message
 */
export async function signUpProfile(data: SignUpSchemaType): Promise<ActionResult<Profile>> {

  // Check authentication
  // Not needed - signing up is open to all

  // Check authorization
  // Not needed - signing up is open to all

  // Check data validity
  try {
    SignUpSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Check for uniqueness constraint violation
  const existing = await db.profile.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existing) {
    return ({ message: "That email address is already in use" });
  }

  // Create and return the new Profile
  try {
    const created = await db.profile.create({
      data: {
        email: data.email,
        // TODO - imageUrl when supported
        name: data.name,
        password: hashPassword(data.password),
      }
    });
    logger.trace({
      context: "ProfileActions.signUpProfile",
      message: "Profile created",
      profile: {
        ...created,
        password: "*REDACTED*",
      },
    });
    return ({model: created});
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to update a Profile.
 *
 * @param profileId                     ID of the Profile to be updated
 * @param data                          Parameters for updating a Profile
 *
 * @returns                             Updated Profile or error message
 */
export async function updateProfile(profileId: IdSchemaType, data: ProfileUpdateSchemaType): Promise<ActionResult<Profile>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  if (profile.id !== profileId) {
    return ({ message: "You can only update your own Profile" });
  }

  // Check data validity
  try {
    IdSchema.parse(profileId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return ({ message: ERRORS.ID_VALIDATION });
  }
  try {
    ProfileUpdateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Check for uniqueness constraint violation if email is specified
  if (data.email) {
    const existing = await db.profile.findUnique({
      where: {
        email: data.email,
        NOT: {
          id: profileId,
        },
      },
    });
    if (existing) {
      return ({ message: "That email address is already in use" });
    }
  }

  // Update and return the Profile
  try {
    const updated = await db.profile.update({
      data: {
        ...data,
        password: data.password ? hashPassword(data.password) : undefined,
        id: profileId, // No cheating allowed
      },
      where: {
        id: profileId
      },
    });
    logger.trace({
      context: "ProfileActions.updateProfile",
      profile: {
        ...updated,
        password: "*REDACTED*",
      }
    });
    return ({ model: updated });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}
