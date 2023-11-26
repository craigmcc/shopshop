"use server";

// @/actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, MemberRole, Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { BadRequest, NotFound, NotUnique, ServerError } from "@/lib/HttpErrors";
import { InitialListData } from "@/lib/InitialListData";
import { logger } from "@/lib/ServerLogger";
import {
  ListWithCategoriesWithItems,
  ListWithMembersWithProfiles,
} from "@/types/types";
import CategoryUncheckedCreateInput = Prisma.CategoryUncheckedCreateInput;

// Public Actions ------------------------------------------------------------

/**
 * Return all Lists for which the specified Profile is a Member.
 *
 * TODO: Distinguish admin versus member?  In the results?
 *
 * @param profileId                     Profile of the user for which to retrieve Lists
 *
 * @throws ServerError                  If a low level error occurs
 */
export const all = async (profileId: string): Promise<List[]> => {
  logger.info({
    context: "ListActions.all",
    profileId: profileId,
  });

  try {
    return await db.list.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.all");
  }
};

/**
 * Return the requested List (if any).  Otherwise, return null.
 *
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If a low level error occurs
 */
export const find = async (listId: string): Promise<List | null> => {
  logger.info({
    context: "ListActions.find",
    listId: listId,
  });

  try {
    return await db.list.findUnique({
      where: {
        id: listId,
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.find");
  }
};

/**
 * Return the requested List by inviteCode (if any).  Otherwise, return null.
 *
 * @param inviteCode                    Invite code of the requested List
 *
 * @throws ServerError                  If a low level error occurs
 */
export const findByInviteCode = async (
  inviteCode: string,
): Promise<List | null> => {
  logger.info({
    context: "ListActions.findByInviteCode",
    inviteCode: inviteCode,
  });

  try {
    return await db.list.findFirst({
      where: {
        inviteCode: inviteCode,
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.findByInviteCode");
  }
};

/**
 * Return the requested List, with nested Categories and Items, if any.
 * Otherwise, return null.
 *
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If a low level error occurs
 */
export const findCategories = async (
  listId: string,
): Promise<ListWithCategoriesWithItems | null> => {
  logger.info({
    context: "ListActions.findCategories",
    listId: listId,
  });

  try {
    return await db.list.findUnique({
      include: {
        categories: {
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
        },
      },
      where: {
        id: listId,
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.findCategories");
  }
};

/**
 * Return the requested List, with nested Members and Profiles, if any.
 * Otherwise, return null.
 *
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If a low level error occurs
 */
export const findMembers = async (
  listId: string,
): Promise<ListWithMembersWithProfiles | null> => {
  logger.info({
    context: "ListActions.find",
    listId: listId,
  });

  try {
    return await db.list.findUnique({
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
      where: {
        id: listId,
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.find");
  }
};

/**
 * Create and return a new List instance, if it satisfies validation.
 * In addition, the specified profileId that created this List
 * will be added as a Member with an ADMIN role.
 *
 * @param list                          List to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (
  list: Prisma.ListUncheckedCreateInput,
): Promise<List> => {
  logger.info({
    context: "ListActions.insert",
    list,
  });

  // TODO - validations

  try {
    const result = await db.list.create({
      data: {
        ...list,
        members: {
          create: [{ profileId: list.profileId, role: MemberRole.ADMIN }],
        },
      },
    });
    await populate(result.id);
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.insert");
  }
};

/**
 * Return the specified List, if the specified Profile is a Member.
 * It includes the specified Member child so that we can check the role.
 *
 * @param profileId                     Profile ID of the user for which to retrieve a List
 * @param listId                        List ID of the requested list
 *
 * @throws ServerError                  If a low level error occurs
 */
export const member = async (
  profileId: string,
  listId: string,
): Promise<List | null> => {
  logger.info({
    context: "ListActions.member",
    profileId: profileId,
    listId: listId,
  });

  try {
    return await db.list.findUnique({
      include: {
        members: {
          where: {
            profileId: profileId,
          },
        },
      },
      where: {
        id: listId,
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
    });
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.member");
  }
};

/**
 * Populate the default Categories and Items for the specified List.
 *
 * @param listId                        ID of the List to be populated
 *
 * @throws NotFound                     If the specified List cannot be found
 * @throws ServerError                  If a low level error occurs
 */
export const populate = async (listId: string): Promise<void> => {
  logger.info({
    context: "ListActions.populate",
    listId: listId,
  });

  const list = await find(listId);
  if (!list) {
    throw new NotFound(`Missing List '${listId}'`, "ListActions.populate");
  }

  try {
    // Erase all current Items and Categories (via cascade) for this List
    await db.category.deleteMany({
      where: {
        listId: listId,
      },
    });

    // Create each defined Category, keeping them around for access to IDs
    const categories: CategoryUncheckedCreateInput[] = [];
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
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.populate");
  }
};

/**
 * Remove an existing List (as well as it's children), if any, and return the
 * removed List object.
 *
 *
 */
export const remove = async (listId: string): Promise<List> => {
  logger.info({
    context: "ListActions.remove",
    listId,
  });

  // TODO - validations

  try {
    const result = await db.list.delete({
      where: {
        id: listId,
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.remove");
  }
};

/**
 * Update an existing List, and return the updated value.
 *
 * @param listId                        ID of the list to be updated
 * @param list                          List values to be updated
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const update = async (
  listId: string,
  list: Prisma.ListUncheckedUpdateInput,
): Promise<List> => {
  logger.info({
    context: "ListActions.update",
    listId,
    list,
  });

  // TODO - validations

  try {
    const result = await db.list.update({
      data: list,
      where: {
        id: listId,
      },
    });
    return result;
  } catch (error) {
    throw new ServerError(error as Error, "ListActions.update");
  }
};
