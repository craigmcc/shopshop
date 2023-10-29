"use server"

// @/actions/MemberActions.ts

/**
 * Server side actions for Member model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Member} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {logger} from "@/lib/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Create and return a new Member instance, if it satisfies validation.
 *
 * @param member                        Member to be created
 *
 * @throws BadRequest                   If validation failes
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (member: Prisma.MemberUncheckedCreateInput): Promise<Member> => {

    logger.info({
        context: "MemberActions.insert",
        list: member,
    });

    // TODO - validations

    try {
        const result = await db.member.create({
            data: member,
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "MemberActions.insert");
    }

}
