// @/actions/ListActions.test.ts

/**
 * Functional tests for ListActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { beforeEach, describe, expect, it, should } from "vitest";

// Internal Modules ----------------------------------------------------------

import { createList, removeList, updateList } from "@/actions/ListActions";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { LISTS, PROFILES } from "@/test/SeedData";
import {
  type ListSchemaType,
  type ListSchemaUpdateType,
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
      const list: ListSchemaType = {
        name: "",
      }

      try {
        await createList(list);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list: ListSchemaType = {
        name: "New List",
      }

      try {
        await createList(list);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list: ListSchemaType = {
        name: "New List",
      }

      try {
        const created = await createList(list);
        expect(created.name).toBe(list.name);
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
      const list = await UTILS.lookupList(LISTS[1].name!);

      try {
        await removeList(list.id);
      } catch (error) {
        expect((error as Error).message).toBe("You are not an ADMIN for this List");
      }

    });

    it("should fail on non-Member", async () => {

      // Pick a Profile that is not a Member
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[2].name!);

      try {
        await removeList(list.id);
      } catch (error) {
        expect((error as Error).message).toBe("You are not an ADMIN for this List");
      }

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list = await UTILS.lookupList(LISTS[0].name!);

      try {
        await removeList(list.id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should pass on an existing List", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!);

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
      const list = await UTILS.lookupList(LISTS[0].name!);
      const update: ListSchemaType = {
        name: "",
      }

      try {
        await updateList(list.id, update);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }

    });

    it("should fail on non-ADMIN Member", async () => {

      // Pick a Profile that is a GUEST Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[1].name!);
      const update: ListSchemaType = {
        name: "Updated List",
      }

      try {
        await updateList(list.id, update);
      } catch (error) {
        expect((error as Error).message).toBe("You are not an ADMIN for this List");
      }

    });

    it("should fail on non-Member", async () => {

      // Pick a Profile that is not a Member
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[2].name!);
      const update: ListSchemaType = {
        name: "Updated List",
      }

      try {
        await updateList(list.id, update);
      } catch (error) {
        expect((error as Error).message).toBe("You are not an ADMIN for this List");
      }

    });

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const list = await UTILS.lookupList(LISTS[0].name!);
      const update: ListSchemaType = {
        name: "Updated List",
      }

      try {
        await updateList(list.id, update);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should pass on empty update", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!);
      const update: ListSchemaUpdateType = {};

      try {
        const updated = await updateList(list.id, update);
        expect(updated.name).toBe(list.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

    it("should pass on valid data", async () => {

      // Pick a Profile that is an ADMIN Member of this List
      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!);
      const update: ListSchemaUpdateType = {
        name: "Updated List",
      }

      try {
        const updated = await updateList(list.id, update);
        expect(updated.name).toBe(update.name);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

});
