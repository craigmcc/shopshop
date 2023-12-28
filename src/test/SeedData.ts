// @/test/SeedData.ts

/**
 * Seed data for tests of Prisma-based actions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Seed Data -----------------------------------------------------------------

// ***** Lists *****

export const LIST0_NAME = "List Zero";
export const LIST1_NAME = "List One";
export const LIST2_NAME = "List Two";

export const LISTS: Prisma.ListUncheckedCreateInput[] = [
  {
    inviteCode: uuidv4(),
    name: LIST0_NAME,
    profileId: "TODO",
  },
  {
    inviteCode: uuidv4(),
    name: LIST1_NAME,
    profileId: "TODO",
  },
  {
    inviteCode: uuidv4(),
    name: LIST2_NAME,
    profileId: "TODO",
  },
];

// ***** Profiles *****

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
