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
  ValidationError,
} from "@/lib/ErrorHelpers";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ProfileSchema,
  type ProfileSchemaType,
  ProfileSchemaUpdate,
  ProfileSchemaUpdateType,
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
export async function createProfile(data: ProfileSchemaType): Promise<Profile> {

  // Check authentication
  // Not needed - signing up is open to all

  // Check authorization
  // Not needed - signing up is open to all

  // Check data validity
  try {
    ProfileSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Create and return the new Profile
  const created = await db.profile.create({
    data,
  });
  logger.info({
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
  logger.info({
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
export async function updateProfile(profileId: IdSchemaType, data: ProfileSchemaUpdateType): Promise<Profile> {

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
    ProfileSchemaUpdate.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
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
  logger.info({
    context: "ProfileActions.updateProfile",
    profile: {
      ...updated,
      password: "*REDACTED*",
    }
  });
  return updated;

}
