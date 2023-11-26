// @/types/types.ts

/**
 * Global types for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, List, Member, Prisma, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

// Category with Items
export type CategoryWithItems = Category & {
  items: Item[];
};

// List with nested Categories and Items
export type ListWithCategoriesWithItems = List & {
  categories: (Category & { items: Item[] })[];
};

// List with nested Members and Profiles
export type ListWithMembersWithProfiles = List & {
  members: (Member & { profile: Profile })[];
};

// Profile creation properties plus ReCaptcha token
export type ProfileUncheckedCreateInputWithToken =
  Prisma.ProfileUncheckedCreateInput & {
    token: string;
  };
