// @/test/SeedData.ts

/**
 * Seed data for tests of Prisma-based actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ServerLogger";
import { ProfileUncheckedCreateInputWithToken } from "@/types/types";

// Seed Data -----------------------------------------------------------------

export const PROFILE0_EMAIL = "first@example.com";
export const PROFILE0_NAME = "First Profile";
export const PROFILE0_PASSWORD = "first";
export const PROFILE1_EMAIL = "second@example.com";
export const PROFILE1_NAME = "Second Profile";
export const PROFILE1_PASSWORD = "second";
export const PROFILE2_EMAIL = "third@example.com";
export const PROFILE2_NAME = "Third Profile";
export const PROFILE2_PASSWORD = "third";

export const PROFILES: Prisma.ProfileUncheckedCreateInput[] = [
  {
    email: PROFILE0_EMAIL,
    name: PROFILE0_NAME,
    password: PROFILE0_PASSWORD,
    scope: "superuser",
  },
  {
    email: PROFILE1_EMAIL,
    name: PROFILE1_NAME,
    password: PROFILE1_PASSWORD,
  },
  {
    email: PROFILE2_EMAIL,
    name: PROFILE2_NAME,
    password: PROFILE2_PASSWORD,
  },
];
