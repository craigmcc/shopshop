// @/actions/ItemActions.test.ts

/**
 * Functional tests for ItemActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import { createItem, removeItem, updateItem } from "@/actions/ItemActions";
import { ERRORS } from "@/lib/ActionResult";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type ItemCreateSchemaType,
  type ItemUpdateSchemaType,
} from "@/zod-schemas/ItemSchema";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("ItemActions", () => {

  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    await UTILS.loadData({
      withCategories: true,
      withItems: true,
      withLists: true,
      withMembers: true,
      withProfiles: true,
    });
  });

  // Test Methods ------------------------------------------------------------

  describe("createItem", () => {

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const item: ItemCreateSchemaType = {
        categoryId: category.id,
        listId: category.listId,
        name: "",
      };
      const result = await createItem(item);

      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(null); // This is deliberate
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const item: ItemCreateSchemaType = {
        categoryId: category.id,
        listId: category.listId,
        name: "New Item",
      }
      const result = await createItem(item);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on valid data for a non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
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

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
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

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(null); // This is deliberate
      const item = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);

      const result = await removeItem(item.id);

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

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);

      const result = await removeItem(item.id);

      expect(result.model).toBeDefined();

    });

    it("should pass on valid data for a GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);

      const result = await removeItem(item.id);

      expect(result.model).toBeDefined();

    });

  });

  describe("updateItem", () => {

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(null); // This is deliberate
      const item = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);

      const result = await updateItem(item.id, { name: "Updated Item" });

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on valid data for a non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, null);

      const data: ItemUpdateSchemaType = {
        name: "New Name",
      };
      const result = await updateItem(item.id, data);

      expect(result.message).toBe("This Profile is not a Member of the owning List");

    });

    it("should pass on valid data for an ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
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
