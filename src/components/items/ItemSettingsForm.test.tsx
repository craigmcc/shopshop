"use client";

// @/components/items/ItemSettingsForm.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ItemSettingsForm } from "@/components/items/ItemSettingsForm";
import { ERRORS } from "@/lib/ActionResult";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { PROFILES } from "@/test/SeedData";

const UTILS = new ActionUtils();

// Test Hooks ----------------------------------------------------------------

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(async () => {
  vi.mock("next/navigation");
  await UTILS.loadData({
    withCategories: true,
    withItems: true,
    withLists: true,
    withMembers: true,
    withProfiles: true,
  });
});

// Test Infrastructure -------------------------------------------------------

function elements() {

  const form = screen.getByRole("form");
  expect(form).toBeDefined();
  const nameField = screen.getByLabelText("Item Name");
  expect(nameField).toBeDefined();
  const submitButton = screen.getByRole("button", { name: "Save" });
  expect(submitButton).toBeDefined();

  return {
    form,
    nameField,
    submitButton,
  }

}

// Test Objects --------------------------------------------------------------

describe("ItemSettingsForm", () => {

  describe("Create Item", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);
      render(<ItemSettingsForm category={category}/>)

      elements();

    });

    // TODO - submit button will have been disabled, so cannot check for message
    it.skip("should fail with invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, null);
      render(<ItemSettingsForm category={category}/>);

      await act(async () => {
        const user = userEvent.setup();
        const { submitButton } = elements();
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      expect(screen.getByText("Item Name is required"));

    });

    it("should fail with valid data for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, null);
      render(<ItemSettingsForm category={category}/>);
      const NEW_NAME = "Brand New Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass with valid data for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.ADMIN);
      render(<ItemSettingsForm category={category}/>);
      const NEW_NAME = "Brand New Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      const item = await UTILS.lookupItemByName(category, NEW_NAME);
      expect(item).toBeDefined();

    });

    it("should pass with valid data for GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const category = await UTILS.lookupCategoryByRole(profile, MemberRole.GUEST);
      render(<ItemSettingsForm category={category}/>);
      const NEW_NAME = "Brand New Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      const item = await UTILS.lookupItemByName(category, NEW_NAME);
      expect(item).toBeDefined();

    });

  });

  describe("Update Item", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategoryById(item.categoryId);
      render(<ItemSettingsForm category={category} item={item}/>);

      elements();

    });

    it("should fail with invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategoryById(item.categoryId);
      render(<ItemSettingsForm category={category} item={item}/>);

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      expect(screen.getByText("Name is required"));

    });

    it("should fail with valid data for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const item = await UTILS.lookupItemByRole(profile, null);
      const category = await UTILS.lookupCategoryById(item.categoryId);
      render(<ItemSettingsForm category={category} item={item}/>);
      const NEW_NAME = "Newly Updated Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass with valid data for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategoryById(input.categoryId);
      render(<ItemSettingsForm category={category} item={input}/>);
      const NEW_NAME = "Updated Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      const output = await UTILS.lookupItemById(input.id);
      expect(output.name).toBe(NEW_NAME);

    });


    it("should pass with valid data for GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupItemByRole(profile, MemberRole.GUEST);
      const category = await UTILS.lookupCategoryById(input.categoryId);
      render(<ItemSettingsForm category={category} item={input}/>);
      const NEW_NAME = "Updated Item";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
        await UTILS.pause(500);
      });

      const output = await UTILS.lookupItemById(input.id);
      expect(output.name).toBe(NEW_NAME);

    });

  });

});
