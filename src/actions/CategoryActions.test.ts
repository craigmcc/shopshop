// @/actions/CategoryActions.test.ts

/**
 * Functional tests for CategoryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, List, MemberRole, Profile } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import {createCategory, removeCategory, updateCategory } from "@/actions/CategoryActions";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type CategoryCreateSchemaType,
  type CategoryUpdateSchemaType,
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
      const category: CategoryCreateSchemaType = {
        listId: lists[0].id,
        name: "",
      }

      const result = await createCategory(category);
      expect(result.message).toBe("Request data does not pass validation");

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const category: CategoryCreateSchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      const result = await createCategory(category);
      expect(result.message).toBe("This Profile is not signed in");

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category: CategoryCreateSchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      const result = await createCategory(category);
      expect(result.message).toBe("This Profile is not a Member of the owning List");

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category: CategoryCreateSchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      const result = await createCategory(category);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBeDefined();
      expect(result.model!.name).toBe(category.name);

    });

  });

  describe("removeCategory", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      const result = await removeCategory(categories[0].id);
      expect(result.message).toBe("This Profile is not signed in");

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.GUEST);

      const result = await removeCategory(category!.id);
      expect(result.message).toBe("This Profile is not an Admin of the owning List");

    });

    it("should pass on existing Category", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);

      const result = await removeCategory(category!.id);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(category!.id);
      expect(result.model!.name).toBe(category!.name);

    });

  });

  describe("updateCategory", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      const result = await updateCategory(categories[0].id, { name: "New Name" });
      expect(result.message).toBe("This Profile is not signed in");

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
//      const category = await lookupCategory(profile, MemberRole.GUEST);
      const members = await db.member.findMany({
        where: {
          profileId: profile.id,
        }
      });
      await db.member.delete({
        where: {
          id: members[0].id,
        }
      });
      const categories = await db.category.findMany({
        where: {
          listId: members[0].listId
        }
      });

      const result = await updateCategory(categories[0].id, { name: "New Name" });
      expect(result.message).toBe("This Profile is not a Member of the owning List");

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);
      const data:CategoryUpdateSchemaType = { name: "" };

      const result = await updateCategory(category.id, data);
      expect(result.message).toBe("Request data does not pass validation");

    });

    it("should pass on existing Category", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await lookupCategory(profile, MemberRole.ADMIN);

      const data: CategoryUpdateSchemaType = { name: "New Name" };
      const result = await updateCategory(category!.id, data);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(category!.id);
      expect(result.model!.name).toBe(data.name);

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
