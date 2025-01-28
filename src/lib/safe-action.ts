// @/lib/next-safe-action.ts

/**
 * Global configuration for next-safe-action clients.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma } from "@prisma/client";
//import * as Sentry from '@sentry/nextjs'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        })
    },
    handleServerError(e, utils) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { clientInput, metadata } = utils

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {  // Uniqueness constraint violation
                logger.error({
                    context: "SafeActionClient.handleError",
                    error: e,
                });
                return e.message;
            }
        }

/*
        Sentry.captureException(e, (scope) => {
            scope.clear()
            scope.setContext('serverError', { message: e.message })
            scope.setContext('metadata', { actionName: metadata?.actionName })
            scope.setContext('clientInput', { clientInput })
            return scope
        })
*/

/* Maybe do this for other Prisma errors?
        if (e.constructor.name === 'NeonDbError') {
            return "Database Error: Your data did not save. Support will be notified."
        }
*/

        return e.message
    }
})
