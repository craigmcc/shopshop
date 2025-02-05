// @/test/SeedData.ts

/**
 * Seed data for testing purposes.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { List, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import { hashPassword } from "@/lib/encryption";

// Public Objects ------------------------------------------------------------

// ***** Categories ***** Will be seeded programmatically

// ***** Items ***** Will be seeded programmatically

// ***** Lists *****

export const LIST_NAME_FIRST = "First List";
export const LIST_NAME_SECOND = "Second List";
export const LIST_NAME_THIRD = "Third List";

export const LISTS: Partial<List>[] = [
    {
        name: LIST_NAME_FIRST,
    },
    {
        name: LIST_NAME_SECOND,
    },
    {
        name: LIST_NAME_THIRD,
    },
];

// ***** Members ***** Will be seeded programmatically

// ***** Profiles *****

export const PROFILE_EMAIL_FIRST = "first@example.com";
export const PROFILE_EMAIL_SECOND = "second@example.com";
export const PROFILE_EMAIL_THIRD = "third@example.com";
export const PROFILE_NAME_FIRST = "First Profile";
export const PROFILE_NAME_SECOND = "Second Profile";
export const PROFILE_NAME_THIRD = "Third Profile";
export const PROFILE_PASSWORD_FIRST = hashPassword("firstpassword");
export const PROFILE_PASSWORD_SECOND = hashPassword("secondpassword");
export const PROFILE_PASSWORD_THIRD = hashPassword("thirdpassword");

export const PROFILES: Partial<Profile>[] = [
    {
        email: PROFILE_EMAIL_FIRST,
        name: PROFILE_NAME_FIRST,
        password: PROFILE_PASSWORD_FIRST,
    },
    {
        email: PROFILE_EMAIL_SECOND,
        name: PROFILE_NAME_SECOND,
        password: PROFILE_PASSWORD_SECOND,
    },
    {
        email: PROFILE_EMAIL_THIRD,
        name: PROFILE_NAME_THIRD,
        password: PROFILE_PASSWORD_THIRD,
    },
];


