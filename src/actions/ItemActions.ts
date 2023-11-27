"use server";
// @/actions/ItemActions.ts

/**
 * Server side actions for Item model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Item, Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { BadRequest, NotFound, NotUnique, ServerError } from "@/lib/HttpErrors";
import { logger } from "@/lib/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Create and return a new Item instance.
 *
 * @param item                          Item to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error occurs
 */
export const insert = async (
  item: Prisma.ItemUncheckedCreateInput,
): Promise<Item> => {
  logger.info({
    context: "ItemActions.insert",
    item: item,
  });

  // TODO - validations

  try {
    const result = await db.item.create({
      data: item,
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ItemActions.insert");
  }
};

/**
 * Remove an existing Item, if any, and return the removed Item object.
 *
 * @param itemId                        ID of the Item to be removed
 *
 * @throws ServerError                  If a low level error occurs
 */
export const remove = async (itemId: string): Promise<Item> => {
  logger.info({
    context: "ItemActions.remove",
    itemId,
  });

  // TODO - validations

  try {
    const result = await db.item.delete({
      where: {
        id: itemId,
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ItemActions.remove");
  }
};

/**
 * Update an existing Item, and return the updated value.
 *
 * @param item                          Item values to be updated (must include id)
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error occurs
 */
export const update = async (
  item: Prisma.ItemUncheckedUpdateInput,
): Promise<Item> => {
  logger.info({
    context: "ItemActions.update",
    item,
  });

  // TODO - validations

  try {
    const result = await db.item.update({
      data: item,
      where: {
        id: String(item.id),
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ItemActions.update");
  }
};
