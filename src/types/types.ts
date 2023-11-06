// @/types/types.ts

/**
 * Global types for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, Item, List, Member, Profile} from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export type ListWithCategoriesWithItems = List & {
    categories: (Category & {items: Item[]})[];
}

export type ListWithMembersWithProfiles = List & {
    members: (Member & {profile: Profile})[];
}

