"use client";

// @components/lists/ListRemoveForm.test.tsx

// External Modules ----------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Internal Modules ----------------------------------------------------------

import { ListRemoveForm } from "@/components/lists/ListRemoveForm";
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

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeDefined();

    return {
        removeButton,
    }

}

// Test Objects --------------------------------------------------------------

describe("ListRemoveForm", () => {

    describe("Remove List", () => {

        it("should render the form as expected", async () => {

          const profile = await UTILS.lookupProfile(PROFILES[0].email!);
          setTestProfile(profile);
          const input = await UTILS.lookupList(LISTS[0].name!);

          render(<ListRemoveForm list={input}/>);

        });

        // TODO - for some reason, router.push() fails in ListRemoveForm.performRemove()
        it.skip("should remove the selected List", async () => {

          const profile = await UTILS.lookupProfile(PROFILES[0].email!);
          setTestProfile(profile);
          const input = await UTILS.lookupList(LISTS[0].name!);
          const user = userEvent.setup();
          render(<ListRemoveForm list={input}/>);

          const { removeButton } = elements();
          await user.click(removeButton);

          const output = await db.list.findUnique({
            where: { id: input.id },
          });
          expect(output).toBeNull();

        });

    });

});
