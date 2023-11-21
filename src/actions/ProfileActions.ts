"use server"

// @/actions/ProfileActions.ts

/**
 * Server side actions for Profile model objects.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Prisma, Profile} from "@prisma/client";
const SECRET = process.env.RECAPTCHA_SECRET_KEY
    ? process.env.RECAPTCHA_SECRET_KEY : "Unknown";
const URL_PATTERN = "https://www.google.com/recaptcha/api/siteverify?secret=:secret&response=:token";

// Internal Modules ----------------------------------------------------------

import {db} from "@/lib/db";
import {hashPassword} from "@/lib/encryption";
import {BadRequest, NotFound, NotUnique, ServerError, ServiceUnavailable} from "@/lib/HttpErrors";
import {logger} from "@/lib/ServerLogger";
import {ProfileUncheckedCreateInputWithToken} from "@/types/types";

// Public Actions ------------------------------------------------------------

/**
 * Create a new Profile, after validating the ReCAPTCHA token that was included.
 *
 * @param profile                       Profile data, including ReCAPTCHA token
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If a low level error occurs
 * @throws ServiceUnavailable           If checking the ReCAPTCHA token fails
 */
/**
 * Create and return a new Profile instance, if it satisfies validation.
 *
 * @param profile                       Profile to be created
 *
 * @throws BadRequest                   If validation fails
 * @throws NotUnique                    If a unique key violation is attempted
 * @throws ServerError                  If some other error occurs
 * @throws ServiceUnavailable           If validating the ReCAPTCHA token fails
 */
export const create = async (profile: ProfileUncheckedCreateInputWithToken): Promise<Profile> => {

    logger.info({
        context: "ProfileActions.create",
        profile: {
            ...profile,
            password: "*REDACTED*",
        }
    });

/* TODO - ContentSecurityPolicy issue
    // Validate the ReCAPTCHA token
    const verifyTokenResponse = await verifyToken(profile.token);
    if (!verifyTokenResponse.success) {
        throw new ServiceUnavailable(
            "Failed ReCAPTCHA validation",
            "ProfileActions.create");
    }
*/

    try {
        return await insert(profile);
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.create");
    }

}

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
        if (result) {
            result.password = "";
        }
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
        if (result) {
            result.password = "";
        }
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
 * @throws BadRequest                   If validation fails
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

    if ((await email(profile.email)) !== null) {
        throw new NotUnique("That email address is already in use");
    }

    try {
        const result = await db.profile.create({
            data: {
                ...profile,
                password: await hashPassword(profile.password),
            }
        });
        if (result) {
            result.password = "";
        }
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.insert");
    }

}

/**
 * Update and return the specified Profile.
 *
 * @param profileId                     ID of the Profile to be updated
 * @param profile                       Profile data to be updaed
 *
 * @throws BadRequest                   If validation fails
 * @throws NotFound                     If no such Profile is found
 * @throws ServerError                  If a low level error is thrown
 */
export const update = async (profileId: string, profile: Prisma.ProfileUpdateInput): Promise<Profile> => {

    logger.info({
        context: "ProfileActions.update",
        profile: {
            ...profile,
            password: profile.password ? "*REDACTED*" : undefined,
        }
    });

    if (!await find(profileId)) {
        throw new NotFound(
            `Missing Profile '${profileId}'`,
            "ProfileActions.update"
        );
    }

    try {
        const result = await db.profile.update({
            data: {
                ...profile,
                password: profile.password ? await hashPassword(String(profile.password)) : undefined,
            },
            where: {
                id: profileId,
            }
        });
        if (result) {
            result.password = "";
        }
        return result;
    } catch (error) {
        throw new ServerError(error as Error, "ProfileActions.insert");
    }

}

// Private Objects -----------------------------------------------------------

export type VerifyTokenResponse = {
    challenge_ts: string;               // ISO format timestamp of the challenge
    "error-codes"?: string[];           // Error code(s) if challenge failed
    hostname: string;                   // Hostname of the challenge
    success: boolean;                   // Was confirmation successful?
}

/**
 * Verify that the specified ReCAPTCHA token is valid.
 *
 * @token                               Token to be validated
 */
export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {

    const url = URL_PATTERN
        .replace(":secret", SECRET)
        .replace(":token", token);
    try {
        const response = await fetch(url, {
            method: "POST",
        });
        return await response.json();
    } catch (error) {
        logger.error({
            context: "ProfileActions.verifyToken",
            token: token,
            error: error,
        });
        throw error;
    }

}
