// @/actions/CategoryActions.test.ts

/**
 * Functional tests for CategoryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, List, MemberRole, Profile } from "@prisma/client";
import { beforeEach, describe, expect, it, should } from "vitest";

// Internal Modules ----------------------------------------------------------

import {createCategory, removeCategory, updateCategory } from "@/actions/CategoryActions";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type CategorySchemaType,
  type CategorySchemaUpdateType,
} from "@/zod-schemas/CategorySchema";

const UTILS = new ActionUtils();
let categories: Category[]= [];
let lists: List[] = [];

// Test Specifications -------------------------------------------------------

describe("CategoryActions", () => {

  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    ({ categories, lists } = await UTILS.loadData({
      withCategories: true,
      withLists: true,
      withMembers: true,
      withProfiles: true,
    }));
  });

  // Test Methods ------------------------------------------------------------

  describe("createCategory", () => {

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category: CategorySchemaType = {
        listId: lists[0].id,
        name: "",
      }

      try {
        await createCategory(category);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const category: CategorySchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      try {
        await createCategory(category);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category: CategorySchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      try {
        await createCategory(category);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not authorized to perform this action");
      }

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category: CategorySchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      try {
        const created = await createCategory(category);
        should().exist(created.id);
        expect(created.name).toBe(category.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

  describe("removeCategory", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      try {
        await removeCategory(categories[0].id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);

      try {
        await removeCategory(category.id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not authorized to perform this action");
      }

    });

    it("should pass on existing Category", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);

      const removed = await removeCategory(category!.id);
      should().exist(removed.id);
      expect(removed.name).toBe(category!.name);

    });

  });

  describe("updateCategory", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      try {
        await updateCategory(categories[0].id, { name: "New Name" });
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.GUEST);

      try {
        await updateCategory(category.id, { name: "New Name" });
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not authorized to perform this action");
      }

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);
      const data:CategorySchemaUpdateType = { name: "" };

      try {
        await updateCategory(category.id, data);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }

    });

    it("should pass on existing Category", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);

      const data: CategorySchemaUpdateType = { name: "New Name" };
      const updated = await updateCategory(category!.id, data);
      expect(updated.name).toBe(data.name);

    });

  });

});

// Private Objects -----------------------------------------------------------

/**
 * Look up and return a Category for which the specified Profile is a
 * Member with the specified MemberRole.
 */
async function lookupCategory(profile: Profile, role: MemberRole): Promise<Category> {

  const member = await db.member.findFirst({
    include: {
      list: {
        include: {
          categories: true,
        },
      },
    },
    where: {
      profileId: profile.id,
      role: role,
    },
  });
  return member!.list.categories[0];

}
