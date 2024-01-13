// @/actions/ProfileActions.test.ts

/**
 * Functional tests for ProfileActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Prisma } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ProfileActions from "./ProfileActions";
import { db } from "@/lib/db";
import { NotFound, NotUnique } from "@/lib/HttpErrors";
import ActionUtils from "@/test/ActionUtils";
import * as SeedData from "@/test/SeedData";

const UTILS = new ActionUtils();

// Test Specifications -------------------------------------------------------

describe("ProfileActions Functional Tests", () => {
  // Test Hooks --------------------------------------------------------------

  beforeEach(async () => {
    await UTILS.loadData({ withProfiles: true });
  });

  // Test Methods ------------------------------------------------------------

  describe("ProfileActions.email()", () => {
    it("should fail on invalid email", async () => {
      const EMAIL = "invalid@nowhere.com";
      try {
        const OUTPUT = await ProfileActions.email(EMAIL);
        expect(OUTPUT).toBeNull();
      } catch (error) {
        fail(`Should not have thrown '${error}'`);
      }
    });

    it("should pass on defined emails", async () => {
      for (const INPUT of SeedData.PROFILES) {
        try {
          const OUTPUT = await ProfileActions.email(INPUT.email);
          expect(OUTPUT).not.toBeNull();
          expect(OUTPUT!.email).toBe(INPUT.email);
        } catch (error) {
          fail(`Should not have thrown '${error}`);
        }
      }
    });
  });

  describe("ProfileActions.find()", () => {
    it("should fail on invalid id", async () => {
      const ID = "";
      try {
        const OUTPUT = await ProfileActions.find(ID);
        expect(OUTPUT).toBeNull();
      } catch (error) {
        fail(`Should not have thrown '${error}'`);
      }
    });

    it("should pass on defined emails", async () => {
      const INPUTS = await db.profile.findMany();
      expect(INPUTS.length).toBeGreaterThan(0);
      for (const INPUT of INPUTS) {
        try {
          const OUTPUT = await ProfileActions.find(INPUT.id);
          expect(OUTPUT).not.toBeNull();
          expect(OUTPUT!.id).toBe(INPUT.id);
        } catch (error) {
          fail(`Should not have thrown '${error}'`);
        }
      }
    });
  });

  describe("ProfileActions.insert", () => {
    it("should fail on duplicate email", async () => {
      const INPUT = await ProfileActions.email(SeedData.PROFILE0_EMAIL);
      expect(INPUT).not.toBeNull();
      try {
        await ProfileActions.insert(INPUT!);
        fail("Should have thrown NotUnique");
      } catch (error) {
        if (error instanceof NotUnique) {
          expect(error.message).toContain(
            "That email address is already in use",
          );
        } else {
          fail(`Should not have thrown '${error}'`);
        }
      }
    });

    it("should pass on valid data", async () => {
      const INPUT: Prisma.ProfileUncheckedCreateInput = {
        email: "new@example.com",
        name: "New Profile",
        password: "new",
      };
      try {
        const OUTPUT = await ProfileActions.insert(INPUT);
        expect(OUTPUT.id).not.toBeNull();
        expect(OUTPUT.email).toBe(INPUT.email);
        expect(OUTPUT.name).toBe(INPUT.name);
        expect(OUTPUT.password).not.toBe(INPUT.password); // Will be hashed
      } catch (error) {
        fail(`Should not have thrown '${error}'`);
      }
    });
  });

  describe("ProfileActions.update", () => {
    it("should fail on invalid ID", async () => {
      const INVALID_ID = "123";
      const ORIGINAL = await ProfileActions.email(SeedData.PROFILE1_EMAIL);
      expect(ORIGINAL).not.toBeNull();
      try {
        await ProfileActions.update(INVALID_ID, ORIGINAL!);
        fail("Should have thrown NotFound");
      } catch (error) {
        if (error instanceof NotFound) {
          expect(error.message).toContain(`Missing Profile '${INVALID_ID}'`);
        } else {
          fail(`Should not have thrown '${error}'`);
        }
      }
    });

    it("should pass on valid data", async () => {
      const ORIGINAL = await ProfileActions.email(SeedData.PROFILE2_EMAIL);
      expect(ORIGINAL).not.toBeNull();
      const UPDATED_NAME = `${ORIGINAL!.name} Updated`;
      try {
        const UPDATED = await ProfileActions.update(ORIGINAL!.id, {
          id: "ABC", // Bogus attempt to change the id
          name: UPDATED_NAME,
        });
        expect(UPDATED).not.toBeNull();
        expect(UPDATED!.id).toBe(ORIGINAL!.id); // Should not be changed
        expect(UPDATED!.name).toBe(UPDATED_NAME);
        expect(UPDATED!.password).toBe(""); // Should be erased
        expect(UPDATED!.scope).toBe(ORIGINAL!.scope);
      } catch (error) {
        fail(`Should not have thrown '${error}`);
      }
    });
  });
});
