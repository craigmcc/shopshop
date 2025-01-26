// @/app/page.test.jsx

// External Modules ----------------------------------------------------------

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Internal Modules ----------------------------------------------------------

import Home from "./page";

// Test Objects --------------------------------------------------------------

describe("Home", () => {

  it("Renders a main section", () => {

    render(<Home/>);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

  });

});
