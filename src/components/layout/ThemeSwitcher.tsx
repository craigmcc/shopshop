"use client";

// @/components/layout/ThemeSwitcher.tsx

/**
 * UI for switching themes in this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useContext } from "react";

// Internal Modules ----------------------------------------------------------

import { ThemeContext } from "@/contexts/ThemeContext";

// Public Objects ------------------------------------------------------------

export const ThemeSwitcher = () => {

  const { changeTheme, theme } = useContext(ThemeContext);

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className="dropdown dropdown-end">
      <details>
        <summary className="btn btn-ghost">Theme</summary>
        <ul tabIndex={0} className="menu dropdown-content z-1 mt-6 shadow-sm bg-base-300 rounded-box">
          {THEMES.map((THEME) => (
            <li
              className={THEME === theme ? "font-bold" : "font-normal"}
              key={THEME}
              onClick={() => changeTheme(THEME)}
            >
              {capitalize(THEME)}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

// Keep this list in sync with the themes in tailwind.config.ts
const THEMES = [
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
];
