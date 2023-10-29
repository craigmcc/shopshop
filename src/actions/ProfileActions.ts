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
 * Find and return the Profile by email (if any), otherwise return null.
 *
 * @param email                         Email of the Profile to return
 *
 * @throws ServerError                  If an error occurs
 */
export const email = async (email: string): Promise<Profile | null> => {

    logger.info({
        context: "ProfileActions.find",
        email: email,
    });

    try {
        const result = await db.profile.findUnique({
            where: {
                email: email,
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.email");
    }

}

/**
 * Find and return the Profile by ID (if any), otherwise return null.
 *
 * @param profileId                     ID of the Profile to return
 *
 * @throws ServerError                  If an error occurs
 */
export const find = async (profileId: string): Promise<Profile | null> => {

    logger.info({
        context: "ProfileActions.find",
        profileId: profileId,
    });

    try {
        const result = await db.profile.findUnique({
            where: {
                id: profileId,
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.find");
    }

}

/**
 * Create and return a new Profile instance, if it satisfies validation.
 *
 * @param profile                       Profile to be created
 *
 * @throws BadRequest                   If validation failes
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 */
export const insert = async (profile: Prisma.ProfileUncheckedCreateInput): Promise<Profile> => {

    logger.info({
        context: "ProfileActions.insert",
        profile: {
            ...profile,
            password: "*REDACTED*",
        }
    });

    // TODO - validations

    try {
        const result = await db.profile.create({
            data: {
                ...profile,
                password: await hashPassword(profile.password),
            }
        });
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.insert");
    }

}
