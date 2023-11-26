"use server";
// @/actions/CategoryActions.ts

/**
 * Server side actions for Category model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item } from "@prisma/client";

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
