// @/actions/ProfileActions.test.ts

/**
 * Functional tests for ProfileActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { should } from "vitest";

// Internal Modules ----------------------------------------------------------

import { createProfile, removeProfile, updateProfile } from "@/actions/ProfileActions";
import {hashPassword} from "@/lib/Encryption";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type ProfileSchemaType,
  type ProfileSchemaUpdateType
} from "@/zod-schemas/ProfileSchema";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("ProfileActions", () => {


  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    await UTILS.loadData({
      withProfiles: true,
    });
  });

  // Test Methods ------------------------------------------------------------

  describe("createProfile", () => {

    it("should fail on invalid data", async () => {

      const profile: ProfileSchemaType = {
        email: "invalid",
        name: "",
        password: "",
      }

      try {
        await createProfile(profile);
      } catch (error) {
        expect((error as Error).message).toBe("Request data does not pass validation");
      }

    });

    it("should pass on valid data", async () => {

      const profile: ProfileSchemaType = {
        email: "test@example.com",
        name: "Test User",
        password: hashPassword("password"),
      }

      try {
        await createProfile(profile);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

  describe("removeProfile", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const profile = await UTILS.lookupProfile(PROFILES[1].email!);

      try {
        await removeProfile(profile.id);
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const caller = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(caller);
      const callee = await UTILS.lookupProfile(PROFILES[2].email!);

      try {
        await removeProfile(callee.id);
      } catch (error) {
        expect((error as Error).message).toBe("You can only remove your own Profile");
      }

    });

    it("should pass on an existing Profile", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);

      try {
        await removeProfile(profile.id);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

  describe("updateProfile", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const profile = await UTILS.lookupProfile(PROFILES[1].email!);

      try {
        await updateProfile(profile.id, {});
      } catch (error) {
        expect((error as Error).message).toBe("This Profile is not signed in");
      }

    });

    it("should fail on not authorized", async () => {

      const caller = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(caller);
      const callee = await UTILS.lookupProfile(PROFILES[2].email!);

      try {
        await updateProfile(callee.id, {});
      } catch (error) {
        expect((error as Error).message).toBe("You can only update your own Profile");
      }

    });

    it("should pass on empty update", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);

      try {
        const updated = await updateProfile(profile.id, {});
        expect(updated.id).toBe(profile.id);
        expect(updated.email).toBe(profile.email);
        expect(updated.name).toBe(profile.name);
        expect(updated.password).toBe(profile.password);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

    it("should pass on valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const update: ProfileSchemaUpdateType = {
        name: profile.name + " Updated",
      }

      try {
        const updated = await updateProfile(profile.id, update);
        expect(updated.id).toBe(profile.id);
        expect(updated.email).toBe(profile.email);
        expect(updated.name).toBe(update.name);
        expect(updated.password).toBe(profile.password);
      } catch (error) {
        should().fail(`Should not have thrown '${error}'`);
      }

    });

  });

});
