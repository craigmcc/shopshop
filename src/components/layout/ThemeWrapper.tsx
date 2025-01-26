"use client"

// @/components/layout/ThemeWrapper.tsx

/**
 * Wrapper (for global layout) the sets the current theme for its children.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useContext } from "react";

// Internal Modules ----------------------------------------------------------

import { ThemeContext } from "@/contexts/ThemeContext";

// Public Objects ------------------------------------------------------------

export const ThemeWrapper = ({children}: {
  children: React.ReactNode;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );

}
