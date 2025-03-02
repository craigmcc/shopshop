"use client";

// @/components/items/ItemSettingsForm.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ItemSettingsForm } from "@/components/items/ItemSettingsForm";
//import { db } from "@/lib/db";
import { InitialListData }  from "@/lib/InitialListData";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { /*ITEMS,*/ LISTS, PROFILES } from "@/test/SeedData";

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

    // TODO - List lookup is not working correctly (membership not created???)
    it.skip("should pass submit with valid data", async () => {

      const profile = await UTILS.lookupProfile(PROFILES[0].email!);
      setTestProfile(profile);
      const list = await UTILS.lookupList(LISTS[0].name!, profile, MemberRole.ADMIN);
      const category = await UTILS.lookupCategory(InitialListData[0][0], list);
      const user = userEvent.setup();
      render(<ItemSettingsForm category={category} profile={profile}/>);
      const NEW_NAME = "Brand New Item";

      const { nameField, submitButton } = elements();
      await user.type(nameField, NEW_NAME);
      await user.click(submitButton);

      const item = await UTILS.lookupItem(NEW_NAME, category);
      expect(item.name).toBe(NEW_NAME);

    });

  });

});
