import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
/*
  // Initially from "https://daisyui.com/docs/config"
  daisyui: {
    base: true, // applies background color and foreground color for root element by default
    darkTheme: "dark", // name of one of the included themes for dark mode
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    styled: true, // include daisyUI colors and design decisions for all components
    themeRoot: ":root", // The element that receives theme color CSS variables
    // Keep this list in sync with the themes in @/components/layout/ThemeSwitcher.tsx
    themes: [
      "light",
      "dark",
      // "acid",
      "aqua",
      "autumn",
      // "black",
      // "bumblebee",
      "business",
      "cmyk",
      "coffee",
      "corporate",
      // "cupcake",
      // "cyberpunk",
      // "dim",
      // "dracula",
      "emerald",
      "fantasy",
      "forest",
      // "garden",
      // "halloween",
      // "lemonade",
      // "lofi",
      "luxury",
      "night",
      "nord",
      "pastel",
      "retro",
      "sunset",
      "synthwave",
      // "valentine",
      "winter",
      // "wireframe",
    ],
    // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    utils: true, // adds responsive and modifier utility classes
  },
*/
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
/*
  plugins: [
    daisyui,
  ],
*/
} satisfies Config;
