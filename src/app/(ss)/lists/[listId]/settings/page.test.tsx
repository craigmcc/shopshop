// @/app/(ss)/lists/[listId]/settings/page.test.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import ListSettingsPage from "@/app/(ss)/lists/[listId]/settings/page";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { LISTS, PROFILES } from "@/test/SeedData";

const UTILS = new ActionUtils();

// Test Objects --------------------------------------------------------------

describe("ListSettingsPage", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach(async () => {
        await UTILS.loadData({
            withLists: true,
            withMembers: true,
            withProfiles: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("not signed in", () => {

        it("should redirect to sign in", async () => {

            setTestProfile(null);
            render(<ListSettingsPage params={Promise.resolve({ listId: "new" })} />);

            expect(screen.findByText("Sign In to ShopShop")).toBeDefined();

        });

    });

    describe("signed in", () => {

        it("Renders a create list page", async () => {

            const profile = await UTILS.lookupProfile(PROFILES[0].email!);
            setTestProfile(profile);
            render(<ListSettingsPage params={Promise.resolve({listId: "new"})}/>);

            expect(screen.findByText("Create List")).toBeDefined();

        });

        it("Renders an error for GUEST Member", async () => {

            const profile = await UTILS.lookupProfile(PROFILES[1].email!);
            setTestProfile(profile);
            const list = await UTILS.lookupListByName(LISTS[0].name!);
            render(<ListSettingsPage params={Promise.resolve({listId: list.id})}/>);

            expect(screen.findByText("You are not an admin")).toBeDefined();

        });

        it("Renders an update list page for ADMIN Member", async () => {

            const profile = await UTILS.lookupProfile(PROFILES[0].email!);
            setTestProfile(profile);
            const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN);
            render(<ListSettingsPage params={Promise.resolve({listId: list.id})}/>);

            expect(screen.findByText("Update List")).toBeDefined();

        });

    });

});
