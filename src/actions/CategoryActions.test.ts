// @/actions/CategoryActions.test.ts

/**
 * Functional tests for CategoryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, List, MemberRole } from "@prisma/client";
import { should } from "vitest";

// Internal Modules ----------------------------------------------------------

import {createCategory, removeCategory/*, updateCategory*/} from "@/actions/CategoryActions";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type CategorySchemaType,
//  type CategorySchemaUpdateType,
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
      const created = await createCategory(category);

      should().exist(created.id);
      expect(created.name).toBe(category.name);

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

      try {
        await removeCategory(categories[0].id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not authorized to perform this action");
      }

    });

    it("should pass on existing Category", async () => {

      // Identify a Category in a List where this Profile is an ADMIN
      const profile = await db.profile.findFirst({
        include: {
          members: {
            include: {
              list: {
                include: {
                  categories: true,
                },
              }
            },
            where: {
              role: MemberRole.ADMIN,
            },
          },
        },
        where: {
          email: PROFILES[0].email,
        }
      });
      setTestProfile(profile);
      const category =  profile!.members[0].list.categories[0];

      const removed = await removeCategory(category!.id);
      should().exist(removed.id);
      expect(removed.name).toBe(category!.name);

    });

  });



});
