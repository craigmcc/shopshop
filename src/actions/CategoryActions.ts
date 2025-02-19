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
  CategoryCreateSchema,
  type CategoryCreateSchemaType,
  CategoryUpdateSchema,
  type CategoryUpdateSchemaType,
} from "@/zod-schemas/CategoryCreateSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a Category.
 *
 * @param data                          Parameters for creating a Category
 *
 * @returns                             Newly created Category
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws ValidationError              If a schema validation error occurs
 */
export async function createCategory(data: CategoryCreateSchemaType): Promise<Category> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError("This Profile is not signed in");
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
    throw new NotAuthorizedError();
  }

  // Check data validity
  try {
    data = CategoryCreateSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Create and return the new Category
  return await db.category.create({
    data,
  });

}

/**
 * Handle request to remove a Category.
 *
 * @param id                            ID of the Category to delete
 *
 * @returns                             Removed Category
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws NotFoundError                If the Category does not exist
 * @throws ValidationError              If a schema validation error occurs
 */
export async function removeCategory(id: IdSchemaType): Promise<Category> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError("This Profile is not signed in");
  }

  // Check authorization and Category existence
  const category = await db.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!category) {
    throw new NotFoundError("That Category does not exist");
  }
  const member = await db.member.findFirst({
    where: {
      listId: category.listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN) {
    throw new NotAuthorizedError();
  }

  // Check data validity
  try {
    IdSchema.parse(id);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Specified ID fails validation");
  }

  // Remove and return the Category
  await db.category.delete({
    where: {
      id: id,
    },
  });
  return category;

}

/**
 * Handle request to update a Category.
 *
 * @param categoryId                    ID of the Category to update
 * @param data                          Parameters for updating a Category
 *
 * @returns                             Updated Category
 *
 * @throws NotAuthenticatedError        If the Profile is not signed in
 * @throws NotAuthorizedError           If the Profile is not a member of the owning List
 * @throws NotFoundError                If the Category does not exist
 * @throws ValidationError              If a schema validation error occurs
 */
export async function updateCategory(categoryId: IdSchemaType, data: CategoryUpdateSchemaType): Promise<Category> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    throw new NotAuthenticatedError();
  }

  // Check authorization and Category existence
  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  if (!category) {
    throw new NotFoundError("That Category does not exist");
  }
  const member = await db.member.findFirst({
    where: {
      listId: category.listId,
      profileId: profile.id,
    }
  });
  if (!member) {
    throw new NotAuthorizedError();
  }

  // Check data validity
  try {
    data = CategoryUpdateSchema.parse(data);
  } catch (error) {
    throw new ValidationError(error as ZodError, "Request data does not pass validation");
  }

  // Update and return the Category
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
    updated,
    user: profile.email,
  });
  return updated;

}
