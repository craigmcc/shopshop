"use client"

// @/components/providers/ThemeProvider.tsx

/**
 * Provider to store the current light/dark theme for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {ThemeProvider as NextThemesProvider} from "next-themes";
import {type ThemeProviderProps} from "next-themes/dist/types";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
