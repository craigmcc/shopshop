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
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import { ListSchema, type ListSchemaType } from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a List.  The currently signed in Profile will be
 * added as an ADMIN member of the new List.
 *
 * @param data                          Parameters for creating a List
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
    throw new ValidationError(error as ZodError);
  }

  // Create and return the new List
  const list = await db.list.create({
    data: {
      ...data,
      members: {
        create: {
          // TODO - is listId needed here?
          profileId: profile.id,
          role: MemberRole.ADMIN,
        }
      }
    },
    include: {
      members: true,
    }
  });
  // TODO - seed the related Category and Item models
  logger.info({
    context: "ListActions.createList",
    list,
    user: profile.email,
  });
  return list;

}

/**
 * Handle request to remove a List.
 *
 * @param listId                      ID of the List to be removed
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
    throw new NotAuthorizedError();
  }

  // Check data validity
  try {
    IdSchema.parse(listId);
  } catch (error) {
    throw new ValidationError(error as ZodError);
  }

  // Remove the List
  // TODO - will this delete all the related Categories and Items and Members?
  const list = await db.list.delete({
    where: { id: listId },
  });
  if (!list) {
    throw new NotFoundError("That List does not exist");
  }
  logger.info({
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
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not an ADMIN member of the List
 * @throws NotFoundError                If the List does not exist
 * @throws ValidationError              If a schema validation error occurs
 */
export async function updateList(listId: IdSchemaType, data: ListSchemaType): Promise<List> {

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
    throw new NotAuthorizedError();
  }

  // Check data validity
  try {
    ListSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Update and return the specified List
  const list = await db.list.update({
    data: data,
    where: {
      id: listId,
    }
  });
  logger.info({
    context: "ListActions.updateList",
    list: list,
    user: profile.email,
  });
  return list;

}
