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
    })


    return [];
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
