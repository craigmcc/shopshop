// @/actions/ProfileActions.test.ts

/**
 * Functional tests for ProfileActions.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;
import { Prisma, Profile } from "@prisma/client";

// Internal Modules ----------------------------------------------------------

import * as ProfileActions from "./ProfileActions";
import { db } from "@/lib/db";
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
});
