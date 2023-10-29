"use server"

// @/actions/ListActions.ts

/**
 * Server side actions for List model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, List} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {logger} from "@/lib/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Create and return a new List instance, if it satisfies validation.
 *
 * @param list                          List to be created
 *
 * @throws BadRequest                   If validation failes
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
            data: list,
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ListActions.insert");
    }

}
