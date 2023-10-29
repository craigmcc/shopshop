"use server"

// @/actions/ProfileActions.ts

/**
 * Server side actions for Profile model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {hashPassword} from "@/lib/encryption";
import {BadRequest, NotFound, NotUnique, ServerError} from "@/lib/HttpErrors";
import {logger} from "@/lib/ServerLogger";

// Public Actions ------------------------------------------------------------

/**
 * Create and return a new Profile instance, if it satisfies validation.
 *
 * @param profile                       Profile to be created
 *
 * @throws BadRequest                   If validation failes
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (profile: Prisma.ProfileCreateInput): Promise<Profile> => {

    logger.info({
        context: "ProfileActions.insert",
        profile: {
            ...profile,
            password: "*REDACTED*",
        }
    });

    // TODO - validations

    const result = await db.profile.create({
        data: {
            ...profile,
            password: await hashPassword(profile.password),
        }
    });
    return result;

}
