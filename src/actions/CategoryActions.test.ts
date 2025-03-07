// @/actions/CategoryActions.test.ts

/**
 * Functional tests for CategoryActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {Category, List, MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ERRORS } from "@/lib/ActionResult";
import {createCategory, removeCategory, updateCategory } from "@/actions/CategoryActions";
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
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const category: CategoryCreateSchemaType = {
        listId: list.id,
        name: "",
      }

      const result = await createCategory(category);
      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const category: CategoryCreateSchemaType = {
        listId: lists[0].id,
        name: "New Category",
      }

      const result = await createCategory(category);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on non-MEMBER", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
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

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
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

      setTestProfile(null);

      const result = await removeCategory(categories[0].id);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on non-Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      const categories = await UTILS.lookupCategories(list);

      const result = await removeCategory(categories[0].id);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list);

      const result = await removeCategory(categories[0].id);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list);

      const result = await removeCategory(categories[0].id);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(categories[0].id);
      expect(result.model!.name).toBe(categories[0].name);

    });

  });

  describe("updateCategory", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);

      const result = await updateCategory(categories[0].id, { name: "New Name" });
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      const categories = await UTILS.lookupCategories(list);

      const result = await updateCategory(categories[0].id, { name: "New Name" });
      expect(result.message).toBe(ERRORS.NOT_MEMBER);

    });

    it("should pass on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list);

      const NEW_NAME = "Brand New Name";
      const result = await updateCategory(categories[0].id, { name: NEW_NAME });
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(NEW_NAME);

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list);
      const data:CategoryUpdateSchemaType = { name: "" };

      const result = await updateCategory(categories[0].id, data);
      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should pass on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list);

      const NEW_NAME = "Brand New Name";
      const result = await updateCategory(categories[0].id, { name: NEW_NAME });
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(NEW_NAME);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list);

      const NEW_NAME = "Brand New Name";
      const result = await updateCategory(categories[0].id, { name: NEW_NAME });
      expect(result.model).toBeDefined();
      expect(result.model!.name).toBe(NEW_NAME);

    });

  });

});
