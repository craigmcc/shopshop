// @/actions/ListActions.test.ts

/**
 * Functional tests for ListActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ERRORS } from "@/lib/ActionResult";
import { createList, removeList, updateList } from "@/actions/ListActions";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { LISTS, PROFILES } from "@/test/SeedData";
import {
  type ListCreateSchemaType,
  type ListUpdateSchemaType,
} from "@/zod-schemas/ListSchema";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("ListActions", () => {

  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    await UTILS.loadData({
      withLists: true,
      withMembers: true,
      withProfiles: true,
    });
  });

  // Test Methods ------------------------------------------------------------

  describe("createList", () => {

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list: ListCreateSchemaType = {
        name: "",
      }

      const result = await createList(list);

      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list: ListCreateSchemaType = {
        name: "New List",
      }

      const result = await createList(list);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);

      const list: ListCreateSchemaType = {
        name: "New List",
      }
      const result = await createList(list);

      expect(result.model).toBeDefined();
      expect(result.model!.id).toBeDefined();
      expect(result.model!.name).toBe(list.name);

    });

  });

  describe("removeList", () => {

    it("should fail on GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);

      const result = await removeList(list.id);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByName(LISTS[2].name!);

      const result = await removeList(list.id);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(null); // This is deliberate
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const result = await removeList(list.id);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should pass on ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const result = await removeList(list.id);

      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(list.id);
      expect(result.model!.name).toBe(list.name);

    });

  });

  describe("updateList", () => {

    it("should fail on not authenticated", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(null); // This is deliberate
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }
      const result = await updateList(list.id, update);

      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const update: ListUpdateSchemaType = {
        name: "",
      }
      const result = await updateList(list.id, update);

      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on non-Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);

      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }
      const result = await updateList(list.id, update);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on GUEST Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);

      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }
      const result = await updateList(list.id, update);

      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should pass on ADMIN member with empty update", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const update: ListUpdateSchemaType = {};
      const result = await updateList(list.id, update);

      expect(result.model!.name).toBe(list.name);

    });

    it("should pass on ADMIN member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);

      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }
      const result = await updateList(list.id, update);

      expect(result.model!.name).toBe(update.name);

    });

  });

});
