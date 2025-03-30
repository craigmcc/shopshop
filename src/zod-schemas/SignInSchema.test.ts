// @/zod-schemas/SignInSchema.test.ts

/**
 * Functional tests for SignInSchema.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ServerLogger";
import { SignInSchema } from "@/zod-schemas/SignInSchema";

// Test Specifications -------------------------------------------------------

describe("SignInSchema", () => {

  it("should throw on empty input fields with parse", () => {

    const input = {
      email: "",
      password: "",
    }
    let result = undefined;

    try {
      result = SignInSchema.parse(input);
      expect(result).toBeUndefined(); // Never really gets here
    } catch (error) {
      logger.trace({
        context: "SignInSchema.test.threw",
        result,
      });
      expect(result).toBeUndefined();
      expect(error).toBeDefined();
      expect(error).toHaveProperty("issues");
      expect((error as ZodError).issues.length).toBe(3);  // 2 required + 1 email
    }

  });

  it("should fail on empty input fields with safeParse", () => {

    const input = {
      email: "",
      password: "",
    }
    const result = SignInSchema.safeParse(input);

    logger.trace({
      context: "SignInSchema.test.empty",
      result,
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues.length).toBe(3);  // 2 required + 1 email

  });

  it("should pass on full input fields with safeParse", () => {

    const input = {
      email: "foo@example.com",
      password: "bar",
    }
    const result = SignInSchema.safeParse(input);

    logger.trace({
      context: "SignInSchema.test.full",
      result,
    });
    expect(result.success).toBe(true);
    expect(result.data!.email).toBe(input.email);
    expect(result.data!.password).toBe(input.password);

  });

});
