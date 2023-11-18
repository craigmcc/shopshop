"use server"

// @/actions/MemberActions.ts

/**
 * Server side actions for Member model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Member, MemberRole} from "@prisma/client";

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

/**
 * Cause the specified Member to leave.
 *
 * @param profileId                     ID of the Profile to leave
 * @param listId                        ID of the List to leave
 *
 * @throws ServerError                  If an error occurs
 */
export const leave = async (profileId: string, listId: string): Promise<void> => {

    logger.info({
        context: "MemberActions.leave",
        profileId,
        listId,
    });

    try {
        await db.member.deleteMany({
            where: {
                profileId,
                listId,
            }
        })
    } catch (error) {
        throw new ServerError(error as Error, "MemberActions.leave");
    }

}

/**
 * Cause the specified Member to be removed.
 *
 * @param memberId                      ID of the Member to be removed
 *
 * @throws ServerError                  If an error occurs
 */
export const remove = async (memberId: string): Promise<void> => {

    logger.info({
        context: "MemberActions.remove",
        memberId,
    });

    try {
        await db.member.delete({
            where: {
                id: memberId,
            }
        })
    } catch (error) {
        throw new ServerError(error as Error, "MemberActions.remove");
    }

}

/**
 * Update the role for the specified Member.
 *
 * @param memberId                      ID of the Member to be updated
 * @param role                          New MemberRole
 *
 * @throws ServerError                  If an error occurs
 */
export const updateRole = async (memberId: string, role: MemberRole) => {

    try {
        await db.member.update({
            data: {
                role: role,
            },
            where: {
                id: memberId,
            }
        });
    } catch (error) {
        throw new ServerError(error as Error, "MemberActions.updateRole");
    }

}
