// @/app/layout.tsx

/**
 * Overall layout for the entire application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type {Metadata} from "next";
import {Inter} from "next/font/google";

// Internal Modules ----------------------------------------------------------

import "./globals.css";
import {LayoutFooter} from "@/components/layout/LayoutFooter";
import {LayoutHeader} from "@/components/layout/LayoutHeader";
import {LayoutSidebar} from "@/components/layout/LayoutSidebar";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "ShopShop",
  description: "Shoppping List Application",
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
        <html lang="en" suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="shopshop-theme"
        >
          <body
              className={cn(
                  inter.className,
                  "bg-indigo-50 dark:bg-indigo-950",
                  "text-black dark:text-white"
              )}
          >
          <LayoutHeader/>
          <div className="h-full">
            <LayoutSidebar/>
            <main className="md:pl-[72px] h-full">
              {children}
            </main>
          </div>
          <LayoutFooter/>
          </body>
        </ThemeProvider>
        </html>
  )
}
