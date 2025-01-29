// @/app/layout.tsx

/**
 * Global layout for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Internal Modules ----------------------------------------------------------

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import { ThemeContextProvider } from "@/contexts/ThemeContext";

// Public Objects ------------------------------------------------------------

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "ShopShop",
  description: "Shopping list app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <ThemeContextProvider>
      <ThemeWrapper>
        <Header />
        {children}
      </ThemeWrapper>
    </ThemeContextProvider>
    </body>
    </html>
  );
}
