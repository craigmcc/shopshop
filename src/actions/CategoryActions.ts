"use server";
// @/actions/CategoryActions.ts

/**
 * Server side actions for Category model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { BadRequest, NotFound, NotUnique, ServerError } from "@/lib/HttpErrors";
import { logger } from "@/lib/ServerLogger";
import { CategoryWithItems } from "@/types/types";

// Public Actions ------------------------------------------------------------

/**
 * Return all Categories for the specified List ID, with nested Items.
 *
 * @param listId                        ID of the requested List
 *
 * @throws ServerError                  If a low level error occurs
 */
export const all = async (listId: string): Promise<CategoryWithItems[]> => {
  logger.info({
    context: "CategoryActions.all",
    listId: listId,
  });

  try {
    return await db.category.findMany({
      include: {
        items: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      where: {
        listId: listId,
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "CategoryActions.all");
  }
};

/**
 * Create and return a new Category instance.
 *
 * @param category                      Category to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error occurs
 */
export const insert = async (
  category: Prisma.CategoryUncheckedCreateInput,
): Promise<Category> => {
  logger.info({
    context: "CategoryActions.insert",
    category: category,
  });

  // TODO - validations

  try {
    const result = await db.category.create({
      data: category,
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "CategoryActions.insert");
  }
};

/**
 * Remove an existing Category (as well as it's children), if any, and return
 * the removed Category object.
 *
 * @param categoryId                    ID of the Category to be removed
 *
 * @throws ServerError                  If a low level error occurs
 */
export const remove = async (categoryId: string): Promise<Category> => {
  logger.info({
    context: "CategoryActions.remove",
    categoryId,
  });

  // TODO - validations

  try {
    const result = await db.category.delete({
      where: {
        id: categoryId,
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "CategoryActions.remove");
  }
};

/**
 * Update an existing Category, and return the updated value.
 *
 * @param categoryId                    ID of the Category to be updated
 * @param category                      Category values to be updated (must include id)
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error occurs
 */
export const update = async (
  categoryId: string,
  category: Prisma.CategoryUncheckedUpdateInput,
): Promise<Category> => {
  logger.info({
    context: "CategoryActions.update",
    categoryId: categoryId,
    category,
  });

  // TODO - validations

  try {
    const result = await db.category.update({
      data: category,
      where: {
        id: categoryId,
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "CategoryActions.update");
  }
};
