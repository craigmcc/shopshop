// @/app/page.test.tsx

/**
 * Test for overall application home page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Internal Modules ----------------------------------------------------------

import HomePage from "./page";

// Test Specifications -------------------------------------------------------

describe("HomePage", () => {
  it("Renders the home page content", () => {
    const renderResult = render(<HomePage />);
    console.log("CONTAINER");
    screen.debug(renderResult.container);
    const welcome = screen.getByText("Hello ShopShop");
    expect(welcome).toBeInTheDocument();
  });
});
