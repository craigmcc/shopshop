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

    // Check sign in status
    const profile = await findProfile();
    if (!profile) {
      redirect("/auth/signIn");
    }
    logger.info({
      context: "listActions.removeListAction.findProfile",
      profile: {
        ...profile,
        password: "*REDACTED",
      }
    });

    // Validate that this List was created by this Profile
    const member = await db.member.findFirst({
      where: {
        listId: list.id,
        profileId: profile.id,
      }
    });
    if (!member) {
      return { message: `List ID ${list.id} was not created by you, so you cannot remove it`}
    }

    // Perform the requested removal
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
    logger.info({
      context: "listActions.saveListAction.findProfile",
      profile: {
        ...profile,
        password: "*REDACTED*",
      }
    });

    // New List
    if (!list.id) {
      // (1) Create the requested List
      const result = await db.list.create({
        data: {
          inviteCode: "", // TODO - get rid of this
          name: list.name,
          profileId: profile.id,
        }
      });
      // (2) Populate it with Categories and Items
      await populate(result.id);
      // (3) Return success message
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
    const result = await db.list.update({
      data: {
        name: list.name,
      },
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
