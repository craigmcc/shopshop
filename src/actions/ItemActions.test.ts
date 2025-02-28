// @/actions/ItemActions.test.ts

/**
 * Functional tests for ItemActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, List, MemberRole, Profile } from "@prisma/client";
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

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const item: ItemCreateSchemaType = {
        categoryId: categories[0].id,
        listId: lists[0].id,
        name: "New Item",
      }

      const result = await createItem(item);
      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on valid data", async () => {

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

    // TODO - review the membership test in ItemActions.updateItem()
    it.skip("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);

      const result = await removeItem(items[2].id);
      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await lookupItem(profile, MemberRole.GUEST);

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

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await lookupItem(profile, MemberRole.GUEST);

      const data: ItemUpdateSchemaType = {
        name: "New Name",
      };
      const result = await updateItem(item.id, data);
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(data.name);

    });

  });

});

// Private Objects -----------------------------------------------------------

/**
 * Look up and return an Iterm for which the specified Profile is a
 * Member with the specified MemberRole.
 */
async function lookupItem(profile: Profile, role: MemberRole): Promise<Item> {

  const member = await db.member.findFirst({
    include: {
      list: {
        include: {
          categories: {
            include: {
              items: true,
            },
          },
        },
      },
    },
    where: {
      profileId: profile.id,
      role: role,
    },
  });
  return member!.list.categories[0].items[0];

}
