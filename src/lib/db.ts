// @/lib/db.ts

/**
 * Utility to return a single instance of PrismaClient, even in development mode.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { PrismaClient } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * A singleton instance of PrismaClient.
 */
if (!globalThis.prisma) {
  const segments = process.env.DATABASE_URL!.split("/");
  logger.info({
    context: "db",
    message: `Initializing PrismaClient for database '${
      segments[segments.length - 1]
    }`,
  });
  globalThis.prisma = new PrismaClient();
}
export const db = globalThis.prisma;
