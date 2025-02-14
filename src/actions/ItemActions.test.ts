// @/actions/ItemActions.test.ts

/**
 * Functional tests for ItemActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Category, Item, List, MemberRole, Profile } from "@prisma/client";
import { should } from "vitest";

// Internal Modules ----------------------------------------------------------

import {createItem, removeItem, updateItem } from "@/actions/ItemActions";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type ItemSchemaType,
  type ItemSchemaUpdateType,
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

      const item: ItemSchemaType = {
        categoryId: members[0].list.categories[0].id,
        listId: members[0].listId,
        name: "",
      };

      try {
        await createItem(item);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }
    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const item: ItemSchemaType = {
        categoryId: categories[0].id,
        listId: lists[0].id,
        name: "New Item",
      }

      try {
        await createItem(item);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const item: ItemSchemaType = {
        categoryId: categories[0].id,
        listId: lists[0].id,
        name: "New Item",
      }

      try {
        await createItem(item);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not a member of this List");
      }

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

      const item: ItemSchemaType = {
        categoryId: members[0].list.categories[0].id,
        listId: members[0].listId,
        name: "New Item",
      };
      const created = await createItem(item);
      should().exist(created.id);
      expect(created.name).toBe(item.name);

    });

  });

  describe("removeItem", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      try {
        await removeItem(items[0].id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);

      try {
        await removeItem(items[0].id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not a member of this List");
      }

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await lookupItem(profile, MemberRole.GUEST);

      try {
        await removeItem(item.id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not a member of this List");
      }

    });

  });

  describe("updateItem", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      try {
        await updateItem(items[0].id, { name: "Updated Item" });
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await lookupItem(profile, MemberRole.GUEST);

      const data: ItemSchemaUpdateType = {
        name: "New Name",
      };
      const updated = await updateItem(item.id, data);
      expect(updated.name).toBe(data.name);

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
