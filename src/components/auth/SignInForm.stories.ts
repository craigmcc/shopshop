// @/components/auth/SignInForm.stories.ts

/**
 * Storybook stories for SignInForm.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type { Meta, StoryObj } from "@storybook/react";

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

export const Default: Story = {};
