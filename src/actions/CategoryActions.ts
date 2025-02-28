"use server"

// @/actions/CategoryActions.ts

/**
 *  Actions for Category models.
 *
 *  @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, MemberRole} from "@prisma/client";
import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

import { ActionResult, ValidationActionResult, ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  CategoryCreateSchema,
  type CategoryCreateSchemaType,
  CategoryUpdateSchema,
  type CategoryUpdateSchemaType,
} from "@/zod-schemas/CategorySchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a Category.
 *
 * @param data                          Parameters for creating a Category
 *
 * @returns                             Newly created Category or error message
 */
export async function createCategory(data: CategoryCreateSchemaType): Promise<ActionResult<Category>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  const list = await db.list.findFirst({
    where: {
      id: data.listId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!list) {
    return ({ message: ERRORS.NOT_MEMBER });
  }

  // Check data validity
  try {
    data = CategoryCreateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Create and return the new Category
  try {
    return ({ model: await db.category.create({
      data,
    }) });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to remove a Category.
 *
 * @param categoryId                    ID of the Category to delete
 *
 * @returns                             Removed Category or error message
 */
export async function removeCategory(categoryId: IdSchemaType): Promise<ActionResult<Category>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization and Category existence
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    return ({ message: "That Category does not exist" });
  }
  const member = await db.member.findFirst({
    where: {
      listId: category.listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN) {
    return ({ message: ERRORS.NOT_ADMIN });
  }

  // Check data validity
  try {
    IdSchema.parse(categoryId);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Remove and return the Category
  try {
    await db.category.delete({
      where: {
        id: categoryId,
      },
    });
    return ({ model: category });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to update a Category.
 *
 * @param categoryId                    ID of the Category to update
 * @param data                          Parameters for updating a Category
 *
 * @returns                             Updated Category or error message
 */
export async function updateCategory(categoryId: IdSchemaType, data: CategoryUpdateSchemaType): Promise<ActionResult<Category>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization and Category existence
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    return ({ message: "That Category does not exist" });
  }
  const member = await db.member.findFirst({
    where: {
      listId: category.listId,
      profileId: profile.id,
    }
  });
  if (!member) {
    return ({ message: ERRORS.NOT_MEMBER });
  }

  // Check data validity
  try {
    data = CategoryUpdateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Update and return the Category
  try {
    const updated = await db.category.update({
      data: {
        ...data,
        id: categoryId, // No cheating allowed
      },
      where: {
        id: categoryId,
      },
    });
    logger.trace({
      context: "CategoryActions.updateCategory",
      category: updated,
      user: profile.email,
    });
    return ({ model: updated });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}
