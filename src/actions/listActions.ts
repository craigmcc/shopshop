// @/actions/listActions.ts

"use server"

/**
 * Actions for List models.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma } from "@prisma/client";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";

// Internal Modules ----------------------------------------------------------

import { findProfile } from "@/actions/authActions";
import { actionClient } from "@/lib/safe-action";
import { db } from "@/lib/db";
import { InitialListData } from "@/lib/InitialListData";
import { logger } from "@/lib/ServerLogger";
import {
  listSchema,
  type listSchemaType,
  removeListSchema,
  removeListSchemaType,
} from "@/zod-schemas/listSchema";

// Public Objects ------------------------------------------------------------

/**
 * Handle remove requests for List models.
 */
export const removeListAction = actionClient
  .metadata({ actionName: "removeListAction" })
  .schema(removeListSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  }).action(async ({
    parsedInput: list
  }: { parsedInput: removeListSchemaType }) => {

    // Determine if an error message was already supplied
    if (list.message) {
      throw new Error(list.message);
    }

    // Check sign in status
    const profile = await findProfile();
    if (!profile) {
      throw new Error("You must be signed in to perform this action");
    }
    logger.trace({
      context: "listActions.removeListAction.findProfile",
      profile,
    });

    // Check admin status of the signed in Profile for this List
    const member = await db.member.findFirst({
      where: {
        listId: list.id,
        profileId: profile.id,
        role: "ADMIN",
      }
    });
    if (!member) {
      throw new Error("You are not an admin for this List, so you cannot remove it");
    }

    // Perform the requested removal
    logger.trace({
      context: "listActions.removeListAction",
      list: list,
    });
    await db.list.delete({
      where: {
        id: list.id,
      }
    });
    return ( { message: `List ID ${list.id} was successfully removed`})

  });

/**
 * Handle create and update requests for List models.
 */
export const saveListAction = actionClient
  .metadata({ actionName: "saveListAction" })
  .schema(listSchema, {
    handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({
    parsedInput: list
  }: { parsedInput: listSchemaType }) => {

    // Check sign in status
    const profile = await findProfile();
    if (!profile) {
      redirect("/auth/signIn");
    }
    logger.trace({
      context: "listActions.saveListAction.findProfile",
      profile: {
        ...profile,
        password: "*REDACTED*",
      }
    });

    // New List
    if (list.id === "") {
      const data = {
        name: list.name,
        profileId: profile.id,
      }
      logger.trace({
        context: "listActions.saveListAction.create",
        data: data,
      });
      // (1) Create the requested List
      const result = await db.list.create({
        data: data,
      });
      // (2) Add Members row for ownership of the new list
      await db.member.create({
        data: {
          listId: result.id,
          profileId: profile.id,
          role: "ADMIN",
        }
      });
      // (3) Populate the List with Categories and Items
      await populate(result.id);
      // (4) Return success message
      return { message: `List ID ${result.id} created successfully`}
    }

    // Existing List
    // (1) Check if this Profile created this List
    const member = await db.member.findFirst({
      where: {
        listId: list.id,
        profileId: profile.id,
      }
    });
    if (!member) {
      return { message: `List ID ${list.id} was not created by you, so you cannot update it`}
    }
    // (2) Perform the requested update
    const data = {
      name: list.name,
    }
    logger.trace({
      context: "listActions.saveListAction.update",
      data: data,
      id: list.id,
      list: list,
    });
    const result = await db.list.update({
      data: data,
      where: {
        id: list.id,
      }
    });
    // (3) Return success message
    return { message: `List ID ${result.id} updated successfully`}

  })

// Private Objects -----------------------------------------------------------

const populate = async (listId: string): Promise<void> => {

  // Create each defined Category, keeping them around for access to IDs
  const categories: Prisma.CategoryUncheckedCreateInput[] = [];
  for (const element of InitialListData) {
    const category = {
      listId: listId,
      name: element[0],
    };
    categories.push(await db.category.create({ data: category }));
  }

  // For each created category, create the relevant Items
  for (let i = 0; i < categories.length; i++) {
    const element = InitialListData[i];
    if (element.length > 1) {
      for (let j = 1; j < element.length; j++) {
        await db.item.create({
          data: {
            categoryId: categories[i].id!,
            checked: false,
            listId: listId,
            name: element[j],
            selected: false,
          },
        });
      }
    }
  }

}
