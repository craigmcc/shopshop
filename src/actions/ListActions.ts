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

import { ActionResult, ValidationActionResult, ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { populateList } from "@/lib/ListHelpers";
import { findProfile } from "@/lib/ProfileHelpers";
import { logger } from "@/lib/ServerLogger";
import { IdSchema, type IdSchemaType } from "@/zod-schemas/IdSchema";
import {
  ListCreateSchema,
  type ListCreateSchemaType,
  ListUpdateSchema,
  type ListUpdateSchemaType,
} from "@/zod-schemas/ListSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle request to create a List.  The currently signed in Profile will be
 * added as an ADMIN member of the new List.
 *
 * @param data                          Parameters for creating a List
 *
 * @returns                             Newly created List or error message
 */
export async function createList(data: ListCreateSchemaType): Promise<ActionResult<List>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  // Not needed - every Profile can create a List

  // Check data validity
  try {
    data = ListCreateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  try {
    // Create the new List
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
    logger.trace({
      context: "ListActions.createList",
      list: created,
      user: profile.email,
    });
    // Also populate the initial Categories and Items for this List
    await populateList(created.id, true, true);
    // Return the new List
    return ({ model: created });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to remove a List.
 *
 * @param listId                      ID of the List to be removed
 *
 * @returns                           Removed List or error message
 */
export async function removeList(listId: IdSchemaType): Promise<ActionResult<List>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    return ({ message: ERRORS.NOT_ADMIN });
  }

  // Check data validity
  try {
    IdSchema.parse(listId);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Remove and return the List
  try {
    const list = await db.list.delete({
      where: {
        id: listId,
      },
    });
    return ({ model: list });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}

/**
 * Handle request to update a List.
 *
 * @param listId                        ID of the List to update
 * @param data                          Parameters for updating a List
 *
 * @returns                             Updated List or error message
 */
export async function updateList(listId: IdSchemaType, data: ListUpdateSchemaType): Promise<ActionResult<List>> {

  // Check authentication
  const profile = await findProfile();
  if (!profile) {
    return ({ message: ERRORS.AUTHENTICATION });
  }

  // Check authorization
  const member = await db.member.findFirst({
    where: {
      listId,
      profileId: profile.id,
    }
  });
  if (!member || member.role !== MemberRole.ADMIN ) {
    return ({ message: ERRORS.NOT_ADMIN });
  }

  // Check data validity
  try {
    IdSchema.parse(listId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return ({ message: ERRORS.ID_VALIDATION });
  }
  try {
    ListUpdateSchema.parse(data);
  } catch (error) {
    return ValidationActionResult(error as ZodError);
  }

  // Update and return the List
  try {
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
    return ({ model: updated });
  } catch (error) {
    return ({ message: (error as Error).message });
  }

}
