import type { StorybookConfig } from "@storybook/nextjs";
import remarkGfm from "remark-gfm";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const config: StorybookConfig = {
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-onboarding",
    "@storybook/addon-themes",
  ],
  docs: {
    autodocs: "tag",
  },
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }
    return config;
  },
};
export default config;
