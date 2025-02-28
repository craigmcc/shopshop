// @/actions/ProfileActions.test.ts

/**
 * Functional tests for ProfileActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import { createProfile, removeProfile, updateProfile } from "@/actions/ProfileActions";
import { ERRORS } from "@/lib/ActionResult";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";
import {
  type ProfileCreateSchemaType,
  type ProfileUpdateSchemaType
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

      const profile: ProfileCreateSchemaType = {
        email: "invalid",
        name: "",
        password: "",
      }

      const result = await createProfile(profile);
      expect(result.message).toBe(ERRORS.DATA_VALIDATION);

    });

    it("should fail on duplicate email", async () => {

      const profile: ProfileCreateSchemaType = {
        email: PROFILES[0].email!,
        name: "Test User",
        password: "password",
      }

      const result = await createProfile(profile);
      expect(result.message).toBe("That email address is already in use");

    });

    it("should pass on valid data", async () => {

      const profile: ProfileCreateSchemaType = {
        email: "test@example.com",
        name: "Test User",
        password: "password",
      }

      const result = await createProfile(profile);
      expect(result.model).toBeDefined();
      expect(result.model!.email).toBe(profile.email);
      expect(result.model!.name).toBe(profile.name);

    });

  });

  describe("removeProfile", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const profile = await UTILS.lookupProfile(PROFILES[1].email!);

      const result = await removeProfile(profile.id);
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on not authorized", async () => {

      const caller = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(caller);
      const callee = await UTILS.lookupProfile(PROFILES[2].email!);

      const result = await removeProfile(callee.id);
      expect(result.message).toBe("You can only remove your own Profile");

    });

    it("should pass on an existing Profile", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);

      const result = await removeProfile(profile.id);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(profile.id);

    });

  });

  describe("updateProfile", () => {

    it("should fail on not authenticated", async () => {

      setTestProfile(null);
      const profile = await UTILS.lookupProfile(PROFILES[1].email!);

      const result = await updateProfile(profile.id, {});
      expect(result.message).toBe(ERRORS.AUTHENTICATION);

    });

    it("should fail on not authorized", async () => {

      const caller = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(caller);
      const callee = await UTILS.lookupProfile(PROFILES[2].email!);

      const result = await updateProfile(callee.id, {});
      expect(result.message).toBe("You can only update your own Profile");

    });

    it("should fail on duplicate email", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const update: ProfileUpdateSchemaType = {
        email: PROFILES[1].email!,
        name: profile.name,
      }

      const result = await updateProfile(profile.id, update);
      expect(result.message).toBe("That email address is already in use");

    });

    it("should pass on empty update", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);

      const result = await updateProfile(profile.id, {});
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(profile.id);
      expect(result.model!.email).toBe(profile.email);
      expect(result.model!.name).toBe(profile.name);
      expect(result.model!.password).toBe(profile.password);

    });

    it("should pass on full update", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const update: ProfileUpdateSchemaType = {
        email: profile.email,
        imageUrl: profile.imageUrl? profile.imageUrl : undefined,
        name: profile.name,
      }

      const result = await updateProfile(profile.id, update);
      expect(result.model).toBeDefined();
      expect(result.model!.id).toBe(profile.id);
      expect(result.model!.email).toBe(profile.email);
      expect(result.model!.name).toBe(profile.name);
      expect(result.model!.password).toBe(profile.password);

    });

  });

});
