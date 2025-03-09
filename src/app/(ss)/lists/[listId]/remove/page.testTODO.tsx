// @/app/(ss)/lists/[listId]/remove/page.tsx

// External Modules ----------------------------------------------------------

import { MemberRole } from "@prisma/client";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import ListRemovePage from "@/app/(ss)/lists/[listId]/remove/page";
import { setTestProfile } from "@/lib/ProfileHelpers";
import { ActionUtils } from "@/test/ActionUtils";
import { LISTS, PROFILES } from "@/test/SeedData";

const UTILS = new ActionUtils();

// Test Objects --------------------------------------------------------------

describe("ListRemovePage", () => {

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
            act(async () => {
                render(<ListRemovePage params={Promise.resolve({ listId: "new" })} />);
            })

            expect(screen.findByText("Sign In to ShopShop")).toBeDefined();

        });

    });

    describe("signed in", () => {

        it("Renders an error for GUEST Member", async () => {

            const profile = await UTILS.lookupProfile(PROFILES[1].email!);
            setTestProfile(profile);
            render(<ListRemovePage params={Promise.resolve({listId: LISTS[0].id!})}/>);

            expect(screen.findByText("You are not an admin of this List, so you cannot remove it")).toBeDefined();

        });

        it("Renders a remove list page for ADMIN Member", async () => {

            const profile = await UTILS.lookupProfile(PROFILES[0].email!);
            setTestProfile(profile);
            const list = await UTILS.lookupListByRole(profile, MemberRole.ADMIN );
            render(<ListRemovePage params={Promise.resolve({listId: list.id})}/>);

            expect(screen.findByText(`Are you sure you want to remove List "${list.name}"}`)).toBeDefined();

        });

    });

});
