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

import { db } from "@/lib/db";
import {
  NotAuthenticatedError,
  NotAuthorizedError,
  NotFoundError,
  UniqueConstraintError,
  ValidationError,
} from "@/lib/ErrorHelpers";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ProfileCreateSchema,
  type ProfileCreateSchemaType,
  ProfileUpdateSchema,
  ProfileUpdateSchemaType,
} from "@/zod-schemas/ProfileSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a Profile.
 *
 * @param data                          Parameters for creating a Profile
 *
 * @returns                             Newly created Profile
 *
 * @throws ValidationError              If a schema validation error occurs
 */
export async function createProfile(data: ProfileCreateSchemaType): Promise<Profile> {

  // Check authentication
  // Not needed - signing up is open to all

  // Check authorization
  // Not needed - signing up is open to all

  // Check data validity
  try {
    ProfileCreateSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Check for uniqueness constraint violation
  const existing = await db.profile.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existing) {
    throw new UniqueConstraintError("That email address is already in use");
  }

  // Create and return the new Profile
  const created = await db.profile.create({
    data,
  });
  logger.trace({
    context: "ProfileActions.createProfile",
    message: "Profile created",
    profile: {
      ...created,
      password: "*REDACTED*",
    },
  });
  return created;

}

/**
 * Handle request to remove a Profile.
 *
 * @param profileId                     ID of the Profile to be removed
 *
 * @returns                             Removed Profile
 *
 * @throws NotFoundError                If no Profile can be found with the given
 * @throws ValidationError              If a schema validation error occurs
 */
export async function removeProfile(profileId: IdSchemaType): Promise<Profile> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization
  if (profile.id !== profileId) {
    throw new NotAuthorizedError("You can only remove your own Profile");
  }

  // Check data validity
  try {
    IdSchema.parse(profileId);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }

  // Remove and return the Profile
  const removed = await db.profile.delete({
    where: {
      id: profileId,
    }
  });
  if (!removed) {
    throw new NotFoundError("That Profile does not exist");
  }
  logger.trace({
    context: "ProfileActions.removeProfile",
    profile: {
      ...removed,
      password: "*REDACTED*",
    }
  });
  return removed;

}

/**
 * Handle request to update a Profile.
 *
 * @param profileId                     ID of the Profile to be updated
 * @param data                          Parameters for updating a Profile
 *
 * @returns                             Updated Profile
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           You can only update your own Profile
 * @throws NotFoundError                If no Profile can be found with the given
 * @throws ValidationError              If a schema validation error occurs
 */
export async function updateProfile(profileId: IdSchemaType, data: ProfileUpdateSchemaType): Promise<Profile> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization
  if (profile.id !== profileId) {
    throw new NotAuthorizedError("You can only update your own Profile");
  }

  // Check data validity
  try {
    IdSchema.parse(profileId);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }
  try {
    ProfileUpdateSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
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
      throw new UniqueConstraintError("That email address is already in use");
    }
  }

  // Update and return the Profile
  const updated = await db.profile.update({
    data: {
      ...data,
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
  return updated;

}
