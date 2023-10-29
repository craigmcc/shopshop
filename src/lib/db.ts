// @/lib/db.ts

/**
 * Utility to return a single instance of PrismaClient, even in development mode.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {PrismaClient} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import logger from "@/lib/ServerLogger";

declare global {
    var prisma: PrismaClient | undefined;
}

// Public Objects ------------------------------------------------------------

/**
 * A singleton instance of PrismaClient.
 */
export const db = globalThis.prisma || new PrismaClient();


if (process.env.NODE_ENV !== "production") {
    const segments = process.env.DATABASE_URL!.split("/");
    logger.info({
        context: "db",
        message: `Initializing PrismaClient for database '${segments[segments.length - 1]}`,
    });
    globalThis.prisma = db;
}
