"use client";

// @/components/lists/ListSettingsForm.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import {render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ListSettingsForm } from "@/components/lists/ListSettingsForm";
import { ERRORS } from "@/lib/ActionResult";
import { db } from "@/lib/db";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { LISTS, PROFILES } from "@/test/SeedData";

const UTILS = new ActionUtils();

// Test Hooks ----------------------------------------------------------------

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(async () => {
  vi.mock("next/navigation");
  await UTILS.loadData({
    withLists: true,
    withMembers: true,
    withProfiles: true,
  });
});

// Test Infrastructure -------------------------------------------------------

function elements() {

  const form = screen.getByRole("form");
  expect(form).toBeDefined();
  const nameField = screen.getByLabelText("List Name");
  expect(nameField).toBeDefined();
  // TODO - add "private" checkbox field
  const submitButton = screen.getByRole("button", { name: "Save" });
  expect(submitButton).toBeDefined();

  return {
    form,
    nameField,
    submitButton,
  }

}

// Test Objects --------------------------------------------------------------

describe("ListSettingsForm", () => {

  describe("Create List", () => {

    it("should render the form as expected", () => {

      render(<ListSettingsForm list={undefined}/>);

      elements();
      expect(screen.findByText("Create List")).toBeDefined();

    });

    it("should fail with validation errors", async () => {

      const user = userEvent.setup();
      render(<ListSettingsForm list={undefined}/>);

      const { submitButton } = elements();
      await user.click(submitButton);
      expect(screen.getByText("Name is required"));

    });

    it("should pass submit with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const user = userEvent.setup();
      render(<ListSettingsForm list={undefined}/>);
      const NEW_NAME = "Brand New List";

      const { nameField, submitButton } = elements();
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const list = await UTILS.lookupListByName(NEW_NAME);
      expect(list.name).toBe(NEW_NAME);

    });

  });

  describe("Update List", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      const list = await UTILS.lookupListByName(LISTS[0].name!);
      setTestProfile(profile);
      render(<ListSettingsForm list={list}/>);

      elements();
      expect(screen.getByText("Update List"));
      // TODO - Doesn't see the name field value having been set, either here or when inspecting
      // expect(screen.getByText(list.name));

    });

    it("should fail with validation errors", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupListByName(LISTS[0].name!);
      const user = userEvent.setup();
      render(<ListSettingsForm list={input}/>);

      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      await user.click(submitButton);
      expect(screen.getByText("Name is required"));

    });

    it("should fail for non-ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const user = userEvent.setup();
      render(<ListSettingsForm list={input!}/>);
      const NEW_NAME = "The Updated List"

      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      expect(screen.getByText(ERRORS.NOT_ADMIN));

    });

    it("should pass for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const user = userEvent.setup();
      render(<ListSettingsForm list={input!}/>);
      const NEW_NAME = "The Updated List"

      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const output = await db.list.findUnique({
        where: { id: input!.id },
      });
      expect(output!.name).toBe(NEW_NAME);

    });

  });

});
