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
//import { db } from "@/lib/db";
import { InitialListData }  from "@/lib/InitialListData";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { /*ITEMS,*/ /*LISTS,*/ PROFILES } from "@/test/SeedData";

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

    it("should fail with validation errors", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategoryByName(list!, InitialListData[0][0]);
      render(<ItemSettingsForm category={category} item={undefined} profile={profile} />);

      const user = userEvent.setup();
      const {  submitButton } = elements();
      await user.click(submitButton);
      expect(screen.getByText("Name is required"));

    });

    it("should fail for non-Member", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, null);
      const category = await UTILS.lookupCategoryByName(list!, InitialListData[0][0]);
      render(<ItemSettingsForm category={category} item={undefined} profile={profile} />);

      const user = userEvent.setup();
      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      const NEW_NAME = "Brand New Item";
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);
      expect(screen.getByText(ERRORS.NOT_MEMBER));

    });

    it("should pass for ADMIN Member with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupListByRole(profile, MemberRole.GUEST);
      const category = await UTILS.lookupCategoryByName(list, InitialListData[0][0]);
      render(<ItemSettingsForm category={category} profile={profile}/>);

      const user = userEvent.setup();
      const { nameField, submitButton } = elements();
      await user.clear(nameField);
      const NEW_NAME = "Brand New Item";
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const item = await UTILS.lookupItemByName(category, NEW_NAME);
      expect(item.name).toBe(NEW_NAME);

    });

  });

});
