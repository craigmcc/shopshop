"use client";

// @/components/auth/SignInForm.tsx

// External Modules ----------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "@/components/auth/SignInForm";
import * as SeedData from "@/test/SeedData";

// Test Hooks ----------------------------------------------------------------

/*
beforeAll(() => {
/!*
  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }));
*!/
  vi.mock("next/navigation");
});
*/

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(async () => {
  vi.mock("next/navigation");
});

// Test Infrastructure -------------------------------------------------------

function elements ()  {

  const form = screen.getByRole("form");
  expect(form).toBeDefined();
  const emailField = screen.getByLabelText("Email");
  expect(emailField).toBeDefined();
  const passwordField = screen.getByLabelText("Password");
  expect(passwordField).toBeDefined();
  const submitButton = screen.getByRole("button", { name: "Sign In" });
  expect(submitButton).toBeDefined();

  return {
    form,
    emailField,
    passwordField,
    submitButton,
  }
}

// Test Objects --------------------------------------------------------------

describe("SignInForm", () => {

  it("should render the form as expected", () => {

    render(<SignInForm/>);
    elements();

  });

  // TODO - Current error handling does not error on blank required fields
  it.skip("should render with validation errors on empty fields", async () => {

    const user = userEvent.setup();
    render(<SignInForm/>);
    const { submitButton } = elements();

    // Submit the form with no field values
    await user.click(submitButton);
//    screen.debug();

    // Check for validation errors
    expect(screen.getByText("Email is required"));
    expect(screen.getByText("Password is required"));

  });

  it("should successfully sign in with valid data", async () => {

    const user = userEvent.setup();
    render(<SignInForm/>);
    const {emailField, passwordField, submitButton} = elements();

    // Populate and submit the form
    await user.type(emailField, SeedData.PROFILE_EMAIL_FIRST);
    await user.type(passwordField, "firstpassword"); // Cannot use hashed version
    await user.click(submitButton);

    // Check for no validation errors
    expect(screen.queryByText("Email is required")).toBeNull();
    expect(screen.queryByText("Password is required")).toBeNull();
    // TODO - SignInForm just puts up a toast

  });

  it("should unsuccessfully sign in with invalid data", async () => {

    const user = userEvent.setup();
    render(<SignInForm/>);
    const {emailField, passwordField, submitButton} = elements();

    // Populate and submit the form
    await user.type(emailField, SeedData.PROFILE_EMAIL_SECOND);
    await user.type(passwordField, "badpassword");
    await user.click(submitButton);

    // Check for server side validation errors
    expect(screen.getByText("Invalid email or password, please try again."));

  });

  it("should unsuccessfully sign in with invalid email", async () => {

    const user = userEvent.setup();
    render(<SignInForm/>);
    const {emailField, passwordField, submitButton} = elements();

    // Populate and submit the form
    await user.type(emailField, "bademail");
    await user.type(passwordField, "badpassword");
    await user.click(submitButton);

    // Check for validation errors
    expect(screen.getByText("Invalid email address"));
    expect(screen.queryByText("Password is required")).toBeNull();

  });

});
