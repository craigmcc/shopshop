// @/actions/ProfileActions.test.ts

/**
 * Functional tests for ProfileActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
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
        expect(OUTPUT).to.be.null;
      } catch (error) {
        expect.fail(`Should not have thrown '${error}'`);
      }
    });

    it("should pass on defined emails", async () => {
      for (const INPUT of SeedData.PROFILES) {
        try {
          const OUTPUT = await ProfileActions.email(INPUT.email);
          expect(OUTPUT).to.not.be.null;
          expect(OUTPUT!.email).to.equal(INPUT.email);
        } catch (error) {
          expect.fail(`Should not have thrown '${error}`);
        }
      }
    });
  });

  describe("ProfileActions.find()", () => {
    it("should fail on invalid id", async () => {
      const ID = "";
      try {
        const OUTPUT = await ProfileActions.find(ID);
        expect(OUTPUT).to.be.null;
      } catch (error) {
        expect.fail(`Should not have thrown '${error}'`);
      }
    });

    it("should pass on defined emails", async () => {
      const INPUTS = await db.profile.findMany();
      expect(INPUTS.length).to.be.greaterThan(0);
      for (const INPUT of INPUTS) {
        try {
          const OUTPUT = await ProfileActions.find(INPUT.id);
          expect(OUTPUT).to.not.be.null;
          expect(OUTPUT!.id).to.equal(INPUT.id);
        } catch (error) {
          expect.fail(`Should not have thrown '${error}'`);
        }
      }
    });
  });

  describe("ProfileActions.insert", () => {
    it("should fail on duplicate email", async () => {
      const INPUT = await ProfileActions.email(SeedData.PROFILE0_EMAIL);
      expect(INPUT).to.not.be.null;
      try {
        await ProfileActions.insert(INPUT!);
        expect.fail("Should have thrown NotUnique");
      } catch (error) {
        if (error instanceof NotUnique) {
          expect(error.message).to.include(
            "That email address is already in use",
          );
        } else {
          expect.fail(`Should not have thrown '${error}'`);
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
        expect(OUTPUT.id).to.not.be.null;
        expect(OUTPUT.email).to.equal(INPUT.email);
        expect(OUTPUT.name).to.equal(INPUT.name);
        expect(OUTPUT.password).to.not.equal(INPUT.password); // Will be hashed
      } catch (error) {
        expect.fail(`Should not have thrown '${error}'`);
      }
    });
  });

  describe("ProfileActions.update", () => {
    it("should fail on invalid ID", async () => {
      const INVALID_ID = "123";
      const ORIGINAL = await ProfileActions.email(SeedData.PROFILE1_EMAIL);
      expect(ORIGINAL).to.not.be.null;
      try {
        await ProfileActions.update(INVALID_ID, ORIGINAL!);
        expect.fail("Should have thrown NotFound");
      } catch (error) {
        if (error instanceof NotFound) {
          expect(error.message).to.include(`Missing Profile '${INVALID_ID}'`);
        } else {
          expect.fail(`Should not have thrown '${error}'`);
        }
      }
    });

    it("should pass on valid data", async () => {
      const ORIGINAL = await ProfileActions.email(SeedData.PROFILE2_EMAIL);
      expect(ORIGINAL).to.not.be.null;
      const UPDATED_NAME = `${ORIGINAL!.name} Updated`;
      try {
        const UPDATED = await ProfileActions.update(ORIGINAL!.id, {
          id: "ABC", // Bogus attempt to change the id
          name: UPDATED_NAME,
        });
        expect(UPDATED).to.not.be.null;
        expect(UPDATED!.id).to.equal(ORIGINAL!.id); // Should not be changed
        expect(UPDATED!.name).to.equal(UPDATED_NAME);
        expect(UPDATED!.password).to.equal(""); // Should be erased
        expect(UPDATED!.scope).to.equal(ORIGINAL!.scope);
      } catch (error) {
        expect.fail(`Should not have thrown '${error}`);
      }
    });
  });
});
