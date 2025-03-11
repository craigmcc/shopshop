// @/actions/CategoryActions.test.ts

/**
 * Functional tests for CategoryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import { createCategory, removeCategory, updateCategory } from "@/actions/CategoryActions";
import { ERRORS } from "@/lib/ActionResult";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type CategoryCreateSchemaType,
  type CategoryUpdateSchemaType,
} from "@/zod-schemas/CategorySchema";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("CategoryActions", () => {

  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    (await UTILS.loadData({
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
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const category: CategoryCreateSchemaType = {
        listId: list.id,
        name: "",
      }
      const result = await createCategory(category);

      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(null); // This is deliberate
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const category: CategoryCreateSchemaType = {
        listId: list.id,
        name: "New Category",
      }
      const result = await createCategory(category);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on non-MEMBER with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);

      const category: CategoryCreateSchemaType = {
        listId: list.id,
        name: "New Category",
      }
      const result = await createCategory(category);

      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const category: CategoryCreateSchemaType = {
        listId: list.id,
        name: "New Category",
      }
      const result = await createCategory(category);

      expect(result.model).toBeDefined();
      expect(result.model!.id).toBeDefined();
      expect(result.model!.name).toBe(category.name);

    });

    it("should pass on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);

      const category: CategoryCreateSchemaType = {
        listId: list.id,
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

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(null); // This is deliberate
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const result = await removeCategory(category.id);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on non-Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, null);

      const result = await removeCategory(category.id);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const result = await removeCategory(category.id);

      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(category.id);
      expect(result.model!.name).toBe(category.name);

    });

    it("should fail on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.GUEST);

      const result = await removeCategory(category.id);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

  });

  describe("updateCategory", () => {

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(null); // This is deliberate
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const result = await updateCategory(category.id, { name: "New Name" });

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const data:CategoryUpdateSchemaType = { name: "" };
      const result = await updateCategory(category.id, data);

      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, null);

      const result = await updateCategory(category.id, { name: "New Name" });

      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);

      const NEW_NAME = "Brand New Name";
      const result = await updateCategory(category.id, { name: NEW_NAME });

      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(NEW_NAME);

    });

    it("should pass on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.GUEST);

      const NEW_NAME = "Brand New Name";
      const result = await updateCategory(category.id, { name: NEW_NAME });

      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(NEW_NAME);

    });

  });

});
