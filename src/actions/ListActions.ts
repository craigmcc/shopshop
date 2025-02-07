"use server";

// @/actions/ListActions.ts

/**
 * Actions for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, MemberRole } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {
  NotAuthenticatedViolation,
  NotAuthorizedViolation,
  NotFoundViolation,
  NotValidViolation,
} from "@/errors/DatabaseErrors";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import {
  ListSchema,
  type ListSchemaType,
  RemoveListSchema,
  RemoveListSchemaType,
} from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a List.  The currently signed in Profile will be
 * added as an ADMIN member of the new List.
 */
export async function createList(data: ListSchemaType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedViolation();
  }

  // Check authorization
  // Not needed - every Profile can create a List

  // Check data validity
  try {
    ListSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new NotValidViolation("Request data does not pass validation");
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
 * @param data                          Parameters for removing a List
 *
 * @throws
 */
export async function removeList(data: RemoveListSchemaType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedViolation();
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId: data.id,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    throw new NotAuthorizedViolation();
  }

  // Check data validity
  try {
    RemoveListSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new NotValidViolation("Request data does not pass validation");
  }

  // Remove the List
  // TODO - will this delete all the related Categories and Items and Members?
  const list = await db.list.delete({
    where: { id: data.id },
  });
  if (!list) {
    throw new NotFoundViolation("That List does not exist");
  }
  logger.info({
    context: "ListActions.removeList",
    list: list,
    user: profile.email,
  });
  return list;
}

/**
 * Handle request to update a List.
 */
export async function updateList(listId: string, data: ListSchemaType): Promise<List> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedViolation();
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    throw new NotAuthorizedViolation();
  }

  // Check data validity
  try {
    ListSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new NotValidViolation("Request data does not pass validation");
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
