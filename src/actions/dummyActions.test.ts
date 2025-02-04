// @/actions/dummyActions.test.ts

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { doAdd, doSubtract } from "@/actions/dummyActions";

// Test Objects --------------------------------------------------------------

describe("dummyActions", () => {

    it("doAdd", async () => {
        expect(await doAdd(2, 3)).toEqual(5);
    });

    it("doSubtract", async () => {
        expect(await doSubtract(5, 3)).toEqual(2);
    });

});
