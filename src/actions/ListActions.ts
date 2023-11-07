"use server"

// @/actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, List, MemberRole} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {logger} from "@/lib/ServerLogger";
import {
    ListWithCategoriesWithItems,
    ListWithMembersWithProfiles
} from "@/types/types";

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
                    }
                },
            },
        });
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.find");
    }

}

/**
 * Return the requested List, with nested Categories and Items, if any.
 * Otherwise, return null.
 *
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If a low level error occurs
 */
export const findCategories = async (listId: string): Promise<ListWithCategoriesWithItems | null> => {

    logger.info({
        context: "ListActions.find",
        listId: listId,
    });

    try {
        return await db.list.findUnique(({
            include: {
                categories: {
                    include: {
                        items: {
                            orderBy: {
                                name: "asc",
                            }
                        }
                    },
                    orderBy: {
                        name: "asc",
                    },
                }
            },
            where: {
                id: listId,
            }
        }));
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.find");
    }

}

/**
 * Return the requested List, with nested Members and Profiles, if any.
 * Otherwise, return null.
 *
 * @param listId                        ID of the List to be returned
 *
 * @throws ServerError                  If a low level error occurs
 */
export const findMembers = async (listId: string): Promise<ListWithMembersWithProfiles | null> => {

    logger.info({
        context: "ListActions.find",
        listId: listId,
    });

    try {
        return await db.list.findUnique(({
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                }
            },
            where: {
                id: listId,
            }
        }));
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.find");
    }

}

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
export const insert = async (list: Prisma.ListUncheckedCreateInput): Promise<List> => {

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
                    create: [
                        {profileId: list.profileId, role: MemberRole.ADMIN}
                    ],
                }
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.insert");
    }

}

/**
 * Return the specified List, if the specified Profile is a Member.
 * It includes the specified Member child so that we can check the role.
 *
 * @param profileId                     Profile ID of the user for which to retrieve a List
 * @param listId                        List ID of the requested list
 *
 * @throws ServerError                  If a low level error occurs
 */
export const member = async (profileId: string, listId: string): Promise<List | null> => {
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
                    }
                },
            },
            where: {
                id: listId,
                members: {
                    some: {
                        profileId: profileId,
                    }
                },
            },
        });
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.member");
    }

}

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
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.remove");
    }

}

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
export const update = async (listId: string, list: Prisma.ListUncheckedUpdateInput): Promise<List> => {

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
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.update");
    }

}
