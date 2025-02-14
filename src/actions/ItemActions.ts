"use server";

// @/actions/ItemActions.ts

/**
 *  Actions for Item models.
 *
 *  @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Item } from "@prisma/client";
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
  ItemSchema,
  type ItemSchemaType,
  ItemSchemaUpdate,
  type ItemSchemaUpdateType,
} from "@/zod-schemas/ItemSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create an Item.
 *
 * @param data                          Parameters for creating an Item
 *
 * @returns                             Newly created Item
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws ValidationError              If a schema validation error occurs
 */
export async function createItem(data: ItemSchemaType): Promise<Item> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError("This Profile is not signed in");
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId: data.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    throw new NotAuthorizedError("This Profile is not a member of this List");
  }
  const category = await db.category.findFirst({
    where: {
      id: data.categoryId,
      listId: data.listId,
    },
  });
  if (!category) {
    throw new NotAuthorizedError("This Category does not exist on this List");
  }

  // Validate input data
  try {
    const parsedData = ItemSchema.parse(data);
    logger.trace({
      context: "ItemActions.createItem.ItemSchema.parse",
      parsedData,
    });
  } catch (error) {
      throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Create and return the new Item
  return await db.item.create({
    data,
  });

}

/**
 * Handle request to remove an Item.
 *
 * @param id                            ID of the Item to delete
 *
 * @returns                             Removed Item
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws NotFoundError                If the Item does not exist
 */
export async function removeItem(id: IdSchemaType): Promise<Item> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError("This Profile is not signed in");
  }

  // Check data validity
  try {
    IdSchema.parse(id);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }

  // Check authorization
  const item = await db.item.findUnique({
    where: {
      id: id,
    },
  });
  if (!item) {
    throw new NotFoundError("This Item does not exist");
  }
  const category = await db.category.findFirst({
    where: {
      id: item.categoryId,
      listId: item.listId,
    },
  });
  if (!category) {
    throw new NotAuthorizedError("This Category does not exist on this List");
  }
  const member = await db.member.findFirst({
    where: {
      listId: item.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    throw new NotAuthorizedError("This Profile is not a Member of this List");
  }

  // Remove and return the Item
  return await db.item.delete({
    where: {
      id: id,
    },
  });

}

/**
 * Handle request to update an Item.
 *
 * @param itemId                        ID of the Item to update
 * @param data                          Parameters for updating the Item
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws NotFoundError                If the Item does not exist
 * @throws ValidationError              If a schema validation error occurs
 */
export async function updateItem(itemId: IdSchemaType, data: ItemSchemaUpdateType): Promise<Item> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError("This Profile is not signed in");
  }

  // Check authorization and Item existence
  const item = await db.item.findUnique({
    where: {
      id: itemId,
    },
  });
  if (!item) {
    throw new NotFoundError("That Item does not exist");
  }
  const member = await db.member.findFirst({
    where: {
      listId: item.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    throw new NotAuthorizedError("This Profile is not a Member of this List");
  }

  // Validate input data
  try {
    const parsedData = ItemSchemaUpdate.parse(data);
    logger.trace({
      context: "ItemActions.updateItem.ItemSchemaUpdate.parse",
      parsedData,
    });
  } catch (error) {
      throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Update and return the Item
  return await db.item.update({
    data: {
      ...data,
      id: itemId,   // No cheating allowed
    },
    where: {
      id: itemId,
    },
  });

}

