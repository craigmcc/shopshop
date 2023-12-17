import type { Preview } from "@storybook/react";
import "@/app/globals.css";
import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from "@storybook/addon-themes";

export const decorators = [
  withThemeByClassName({
    defaultTheme: "light",
    themes: {
      dark: "dark",
      light: "light",
    },
  }),
  withThemeByDataAttribute({
    attributeName: "data-mode",
    defaultTheme: "light",
    themes: {
      dark: "dark",
      light: "light",
    },
  }),
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
