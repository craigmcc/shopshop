"use server";

// @/actions/ListActions.ts

/**
 * Actions for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, MemberRole } from "@prisma/client";
import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import {
  NotAuthenticatedError,
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
} from "@/lib/ErrorHelpers";
import { populateList } from "@/lib/ListHelpers";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ListSchema,
  type ListSchemaType,
  ListSchemaUpdate,
  type ListSchemaUpdateType,
} from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a List.  The currently signed in Profile will be
 * added as an ADMIN member of the new List.
 *
 * @param data                          Parameters for creating a List
 *
 * @returns                             Newly created List
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws ValidationError              If a schema validation error occurs
 */
export async function createList(data: ListSchemaType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization
  // Not needed - every Profile can create a List

  // Check data validity
  try {
    ListSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Create and return the new List
  const created = await db.list.create({
    data: {
      ...data,
      members: {
        create: {
          profileId: profile.id,
          role: MemberRole.ADMIN,
        }
      }
    },
    include: {
      members: true,
    }
  });
  // Also populate the initial Categories and Items for this List
  await populateList(created.id, true, true);
  logger.trace({
    context: "ListActions.createList",
    list: created,
    user: profile.email,
  });
  return created;

}

/**
 * Handle request to remove a List.
 *
 * @param listId                      ID of the List to be removed
 *
 * @returns                           Removed List
 *
 * @throws NotAuthenticatedError      If the Profile is not signed in
 * @throws NotAuthorizedError         If the Profile is not an ADMIN member of the List
 * @throws NotFoundError              If the List does not exist
 * @throws ValidationError            If a schema validation error occurs
 *
 */
export async function removeList(listId: IdSchemaType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    throw new NotAuthorizedError("You are not an ADMIN for this List");
  }

  // Check data validity
  try {
    IdSchema.parse(listId);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }

  // Remove and return the List
  const list = await db.list.delete({
    where: { id: listId },
  });
  if (!list) {
    throw new NotFoundError("That List does not exist");
  }
  logger.trace({
    context: "ListActions.removeList",
    list: list,
    user: profile!.email,
  });
  return list;
}

/**
 * Handle request to update a List.
 *
 * @param listId                        ID of the List to be updated
 * @param data                          Parameters for updating a List
 *
 * @returns                             Updated List
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not an ADMIN member of the List
 * @throws NotFoundError                If the List does not exist
 * @throws ValidationError              If a schema validation error occurs
 */
export async function updateList(listId: IdSchemaType, data: ListSchemaUpdateType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    throw new NotAuthorizedError("You are not an ADMIN for this List");
  }

  // Check data validity
  try {
    IdSchema.parse(listId);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }
  try {
    ListSchemaUpdate.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Update and return the List
  const updated = await db.list.update({
    data: {
      ...data,
      id: listId, // No cheating allowed
    },
    where: {
      id: listId,
    }
  });
  logger.trace({
    context: "ListActions.updateList",
    list: updated,
    user: profile.email,
  });
  return updated;

}
