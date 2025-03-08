// @/actions/ItemActions.test.ts

/**
 * Functional tests for ItemActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, List, MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import {createItem, removeItem, updateItem } from "@/actions/ItemActions";
import { ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type ItemCreateSchemaType,
  type ItemUpdateSchemaType,
} from "@/zod-schemas/ItemSchema";

const UTILS = new ActionUtils();
let categories: Category[]= [];
let items: Item[]= [];
let lists: List[] = [];

// Test Specifications -------------------------------------------------------

describe("ItemActions", () => {

  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    ({categories, items, lists} = await UTILS.loadData({
      withCategories: true,
      withItems: true,
      withLists: true,
      withMembers: true,
      withProfiles: true,
    }));
  });

  // Test Methods ------------------------------------------------------------

  describe("createItem", () => {

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const members = await db.member.findMany({
        include: {
          list: {
            include: {
              categories: true,
            },
          },

        },
        where: {
          profileId: profile.id,
        },
      });

      const item: ItemCreateSchemaType = {
        categoryId: members[0].list.categories[0].id,
        listId: members[0].listId,
        name: "",
      };

      const result = await createItem(item);
      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const item: ItemCreateSchemaType = {
        categoryId: categories[0].id,
        listId: lists[0].id,
        name: "New Item",
      }

      const result = await createItem(item);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on valid data for a non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, null);
      const item: ItemCreateSchemaType = {
        categoryId: category.id,
        listId: category.listId,
        name: "New Item",
      };

      const result = await createItem(item);
      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on valid data for an ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);
      const item: ItemCreateSchemaType = {
        categoryId: category.id,
        listId: category.listId,
        name: "New Item",
      };

      const result = await createItem(item);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBeDefined();
      expect(result.model!.name).toBe(item.name);

    });

    it("should pass on valid data for an GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.GUEST);
      const item: ItemCreateSchemaType = {
        categoryId: category.id,
        listId: category.listId,
        name: "New Item",
      };

      const result = await createItem(item);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBeDefined();
      expect(result.model!.name).toBe(item.name);

    });

  });

  describe("removeItem", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      const result = await removeItem(items[0].id);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on valid data for a non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, null);

      const result = await removeItem(item.id);
      expect(result.message).toBe("This Profile is not a Member of the owning List");

    });

    it("should pass on valid data for an ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);

      const result = await removeItem(item.id);
      expect(result.model).toBeDefined();

    });

    it("should pass on valid data for a GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);

      const result = await removeItem(item.id);
      expect(result.model).toBeDefined();

    });

  });

  describe("updateItem", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      const result = await updateItem(items[0].id, { name: "Updated Item" });
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on valid data for a non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, null);

      const data: ItemUpdateSchemaType = {
        name: "New Name",
      };
      const result = await updateItem(item.id, data);
      expect(result.message).toBe("This Profile is not a Member of the owning List");

    });

    it("should pass on valid data for an ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);

      const data: ItemUpdateSchemaType = {
        name: "New Name",
      };
      const result = await updateItem(item.id, data);
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(data.name);

    });

    it("should pass on valid data for a GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);

      const data: ItemUpdateSchemaType = {
        name: "New Name",
      };
      const result = await updateItem(item.id, data);
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(data.name);

    });

  });

});
