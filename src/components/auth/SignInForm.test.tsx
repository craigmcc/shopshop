"use client";

// @/components/auth/SignInForm.tsx

// External Modules ----------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { act } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "./SignInForm";

// Test Hooks ----------------------------------------------------------------

beforeAll(() => {
/*
  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
    }),
  }));
*/
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

  it("Renders the form", () => {

    render(<SignInForm/>);
    elements();

  });

  it("Renders the form with errors", () => {

    render(<SignInForm/>);
    const { /*emailField, passwordField,*/ submitButton} = elements();

    // Submit the form
    act(() => submitButton.click());
//    submitButton.click();
    expect(submitButton).toBeDefined();
    screen.debug();

    // Check for errors
//    expect(form).toHaveFormErrors();
//    expect(emailField).to.have.error.message("Email is required");
//    expect(passwordField).toHaveErrorMessage("Password is required");
//    expect(emailField).not.toBeValid();
//    expect(passwordField).not.toBeValid();

  });

});
