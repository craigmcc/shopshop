"use client";

// @/components/items/CategorySettingsForm.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { CategorySettingsForm } from "@/components/categories/CategorySettingsForm";
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
    withLists: true,
    withMembers: true,
    withProfiles: true,
  });
});

// Test Infrastructure -------------------------------------------------------

function elements() {

  const form = screen.getByRole("form");
  expect(form).toBeDefined();
  const nameField = screen.getByLabelText("Category Name");
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

describe("CategorySettingsForm", () => {

  describe("Create Category", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      render(<CategorySettingsForm list={list} profile={profile}/>);

      elements();
      expect(screen.findByText("Create Category")).toBeDefined();

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      render(<CategorySettingsForm list={list} profile={profile}/>);

      await act(async () => {
        const user = userEvent.setup();
        const { submitButton } = elements();
        await user.click(submitButton);
      });

      expect(screen.getByText("Name is required"));

    });

    it("should fail with valid data for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      render(<CategorySettingsForm list={list} profile={profile}/>);
      const NEW_NAME = "Brand New Category";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass with valid data for ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      render(<CategorySettingsForm list={list} profile={profile}/>);
      const NEW_NAME = "Brand New Category";

      await act(async () => {
        const user = userEvent.setup();
        const {nameField, submitButton} = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      const category = await UTILS.lookupCategoryByName(list, NEW_NAME);
      expect(category).toBeDefined();

    });

    it("should pass with valid data for GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      render(<CategorySettingsForm list={list} profile={profile}/>);
      const NEW_NAME = "Brand New Category";

      await act(async () => {
        const user = userEvent.setup();
        const {nameField, submitButton} = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      const category = await UTILS.lookupCategoryByName(list, NEW_NAME);
      expect(category).toBeDefined();

    });

  });

  describe("Update Category", () => {

    it("should render the form as expected", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<CategorySettingsForm category={categories[0]} profile={profile}/>);

      elements();
      expect(screen.findByText("Update Category")).toBeDefined();

    });

    it("should fail on invalid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<CategorySettingsForm category={categories[0]} profile={profile}/>);

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.click(submitButton);
      });

      expect(screen.getByText("Name is required"));

    });

    it("should fail with valid data for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      const categories = await UTILS.lookupCategories(list!);
      render(<CategorySettingsForm category={categories[0]} profile={profile}/>);
      const NEW_NAME = "Updated Category";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass with valid data for an ADMIN Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[2].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<CategorySettingsForm category={categories[0]} profile={profile}/>);
      const NEW_NAME = "Updated Category";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      const category = await UTILS.lookupCategoryByName(list, NEW_NAME);
      expect(category).toBeDefined();

    });

    it("should pass with valid data for a GUEST Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[1].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const categories = await UTILS.lookupCategories(list!);
      render(<CategorySettingsForm category={categories[0]} profile={profile}/>);
      const NEW_NAME = "Updated Category";

      await act(async () => {
        const user = userEvent.setup();
        const { nameField, submitButton } = elements();
        await user.clear(nameField);
        await user.type(nameField, NEW_NAME);
        await user.click(submitButton);
      });

      const category = await UTILS.lookupCategoryByName(list, NEW_NAME);
      expect(category).toBeDefined();

    });

  });

});
