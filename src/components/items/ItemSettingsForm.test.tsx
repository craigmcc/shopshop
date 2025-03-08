"use client";

// @/components/items/ItemSettingsForm.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { render, screen } from "@testing-library/react";
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
      render(<ItemSettingsForm profile={profile}/>)

      elements();
      expect(screen.findByText("Create Item")).toBeDefined();

    });

    it("should fail with invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<ItemSettingsForm category={categories[0]} item={undefined} profile={profile} />);

      const user = userEvent.setup();
      const {  submitButton } = elements();
      await user.click(submitButton);

      expect(screen.getByText("Name is required"));

    });

    it("should fail with valid data for for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      const categories = await UTILS.lookupCategories(list!);
      render(<ItemSettingsForm category={categories[0]} item={undefined} profile={profile} />);

      const user = userEvent.setup();
      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      const NEW_NAME = "Brand New Item";
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);
      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass with valid data for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<ItemSettingsForm category={categories[0]} profile={profile}/>);

      const user = userEvent.setup();
      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      const NEW_NAME = "Brand New Item";
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const item = await UTILS.lookupItemByName(categories[0], NEW_NAME);
      expect(item).toBeDefined();

    });

    it("should pass with valid data for GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list!);
      render(<ItemSettingsForm category={categories[0]} profile={profile}/>);

      const user = userEvent.setup();
      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      const NEW_NAME = "Brand New Item";
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const item = await UTILS.lookupItemByName(categories[0], NEW_NAME);
      expect(item).toBeDefined();

    });

  });

  describe("Update Item", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list!);
      const items = await UTILS.lookupItems(categories[0]);
      render(<ItemSettingsForm item={items[0]} profile={profile}/>);

      elements();
      expect(screen.findByText("Update Item")).toBeDefined();

    });

    it("should fail with invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      const items = await UTILS.lookupItems(categories[0]);
      render(<ItemSettingsForm item={items[0]} profile={profile}/>);

      const user = userEvent.setup();
      const {  nameField, submitButton } = elements();
      await user.clear(nameField);
      await user.click(submitButton);

      expect(screen.getByText("Name is required"));

    });

    it("should fail with valid data for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupItemByRole(profile, null);
      const category = await UTILS.lookupCategory(input.categoryId);
      render(<ItemSettingsForm item={input} profile={profile}/>);

      const user = userEvent.setup();
      const {  nameField, submitButton } = elements();
      const NEW_NAME = "Newly Updated Item";
      await user.clear(nameField);
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const items = await UTILS.lookupItems(category);
      expect(items.filter(item => item.name === NEW_NAME).length).toBe(0);

    });

    it("should pass with valid data for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const input = await UTILS.lookupItemByRole(profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategory(input.categoryId);
      render(<ItemSettingsForm item={input} profile={profile}/>);

      const user = userEvent.setup();
      const {  nameField, submitButton } = elements();
      const NEW_NAME = "Newly Updated Item";
      await user.clear(nameField);
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const output = await UTILS.lookupItemByName(category, NEW_NAME);
      expect(output.name).toBe(NEW_NAME);

    });

    it("should pass with valid data for GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const categories = await UTILS.lookupCategories(list!);
      const items = await UTILS.lookupItems(categories[0]);
      render(<ItemSettingsForm item={items[0]} profile={profile}/>);

      const user = userEvent.setup();
      const {  nameField, submitButton } = elements();
      const NEW_NAME = "Newly Updated Item";
      await user.clear(nameField);
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const item = await UTILS.lookupItemByName(categories[0], NEW_NAME);
      expect(item).toBeDefined();

    });

  });

});
