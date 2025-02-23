// @/app/page.test.jsx

// External Modules ----------------------------------------------------------

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Internal Modules ----------------------------------------------------------

import Home from "./page";

// Test Objects --------------------------------------------------------------

describe("Home", () => {

  it("Renders a main section", () => {

    render(<Home/>);

    const main = screen.getByRole("main");
    expect(main).toBeDefined();

  });

});
