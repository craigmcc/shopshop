// @/components/auth/SignInForm.stories.ts

/**
 * Storybook stories for SignInForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "./SignInForm";

// Public Objects ------------------------------------------------------------

const meta = {
  component: SignInForm,
  tags: ["autodocs"],
  title: "Auth/SignInForm",
} satisfies Meta<typeof SignInForm>;
export default meta;

type Story = StoryObj<typeof meta>;

// Press the "Close" button and verify that it worked
export const Close: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // TODO: button[0] is "Save", button[1] is "Close" but not found - because of modal?
    const buttons = canvas.getAllByRole("button");
    console.log(buttons);
  },
};

export const Display: Story = {};
