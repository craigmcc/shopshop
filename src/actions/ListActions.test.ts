// @/actions/ListActions.test.ts

/**
 * Functional tests for ListActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { beforeEach, describe, expect, it, should } from "vitest";

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

      try {
        const created = await createList(list);
        should().exist(created.model!.id);
        expect(created.model!.name).toBe(list.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

  describe("removeList", () => {

    it("should fail on non-ADMIN Member", async () => {

      // Pick a Profile that is a GUEST Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[1].name!, profile, MemberRole.GUEST);

      const result = await removeList(list.id);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on non-Member", async () => {

      // Pick a Profile that is not a Member
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByName(LISTS[2].name!);

      const result = await removeList(list.id);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list = await UTILS.lookupListByName(LISTS[0].name!);

      const result = await removeList(list.id);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should pass on an existing List", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!, profile, MemberRole.ADMIN);

      try {
        await removeList(list.id);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

  describe("updateList", () => {

    it("should fail on invalid data", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!, profile, MemberRole.ADMIN);
      const update: ListUpdateSchemaType = {
        name: "",
      }

      const result = await updateList(list.id, update);
      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on non-ADMIN Member", async () => {

      // Pick a Profile that is a GUEST Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[1].name!, profile, MemberRole.GUEST);
      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }

      const result = await updateList(list.id, update);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on non-Member", async () => {

      // Pick a Profile that is not a Member
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByName(LISTS[2].name!);
      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }

      const result = await updateList(list.id, update);
      expect(result.message).toBe(ERRORS.NOT_ADMIN);

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list = await UTILS.lookupListByName(LISTS[0].name!);
      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }

      const result = await updateList(list.id, update);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should pass on empty update", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!, profile, MemberRole.ADMIN);
      const update: ListUpdateSchemaType = {};

      try {
        const result = await updateList(list.id, update);
        expect(result.model!.name).toBe(list.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

    it("should pass on valid data", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!, profile, MemberRole.ADMIN);
      const update: ListUpdateSchemaType = {
        name: "Updated List",
      }

      try {
        const result = await updateList(list.id, update);
        expect(result.model!.name).toBe(update.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

});
