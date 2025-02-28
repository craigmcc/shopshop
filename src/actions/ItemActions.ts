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

import { ActionResult, ValidationActionResult, ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ItemCreateSchema,
  type ItemCreateSchemaType,
  ItemUpdateSchema,
  type ItemUpdateSchemaType,
} from "@/zod-schemas/ItemSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create an Item.
 *
 * @param data                          Parameters for creating an Item
 *
 * @returns                             Newly created Item or error message
 */
export async function createItem(data: ItemCreateSchemaType): Promise<ActionResult<Item>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId: data.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    return ({ message: ERRORS.NOT_MEMBER });
  }
  const category = await db.category.findFirst({
    where: {
      id: data.categoryId,
      listId: data.listId,
    },
  });
  if (!category) {
    return ({ message: "This Category does not exist on this List" });
  }

  // Validate input data
  try {
    const parsedData = ItemCreateSchema.parse(data);
    logger.trace({
      context: "ItemActions.createItem.ItemSchema.parse",
      parsedData,
    });
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  try {
    // Create the new Item
    const created = await db.item.create({
      data: {
        ...data,
      },
    });
    logger.trace({
      context: "ItemActions.createItem",
      item: created,
      user: profile!.email,
    });
    // Return the new Item
    return ({ model: created });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to remove an Item.
 *
 * @param itemId                        ID of the Item to delete
 *
 * @returns                             Removed Item or error message
 */
export async function removeItem(itemId: IdSchemaType): Promise<ActionResult<Item>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check data validity
  try {
    IdSchema.parse(itemId);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Check authorization
  const item = await db.item.findUnique({
    where: {
      id: itemId,
    },
  });
  if (!item) {
    return ({ message: "This Item does not exist" });
  }
  const category = await db.category.findFirst({
    where: {
      id: item.categoryId,
      listId: item.listId,
    },
  });
  if (!category) {
    return ({ message: "This Category does not exist on this List" });
  }
  const member = await db.member.findFirst({
    where: {
      listId: item.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    return ({ message: ERRORS.NOT_MEMBER });
  }

  // Remove and return the Item
  try {
    await db.item.delete({
      where: {
        id: itemId,
      },
    });
    return ({ model: item });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to update an Item.
 *
 * @param itemId                        ID of the Item to update
 * @param data                          Parameters for updating an Item
 *
 * @returns                             Updated Item or error message
 */
export async function updateItem(itemId: IdSchemaType, data: ItemUpdateSchemaType): Promise<ActionResult<Item>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization and Item existence
  const item = await db.item.findUnique({
    where: {
      id: itemId,
    },
  });
  if (!item) {
    return ({ message: "This Item does not exist" });
  }
  const member = await db.member.findFirst({
    where: {
      listId: item.listId,
      profileId: profile.id,
    },
  });
  if (!member) {
    return ({ message: ERRORS.NOT_MEMBER });
  }

  // Check data validity
  try {
    IdSchema.parse(itemId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return ({ message: ERRORS.ID_VALIDATION });
  }
  try {
    ItemUpdateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Update and return the Item
  try {
    const updated = await db.item.update({
      data: {
        ...data,
        id: itemId,   // No cheating allowed
      },
      where: {
        id: itemId,
      },
    });
    logger.trace({
      context: "ItemActions.updateItem",
      item: updated,
      user: profile!.email,
    });
    return ({ model: updated });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

