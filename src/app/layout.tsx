// @/app/layout.tsx

/**
 * Overall layout for the entire application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { GeistSans } from "geist/font";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

// Internal Modules ----------------------------------------------------------

import "./globals.css";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LayoutFooter } from "@/components/layout/LayoutFooter";
import { LayoutHeader } from "@/components/layout/LayoutHeader";
import { LayoutSidebar } from "@/components/layout/LayoutSidebar";
import { ModalProvider } from "@/components/providers/ModalProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { logger } from "@/lib/ServerLogger";
import { cn } from "@/lib/utils";

// Public Objects ------------------------------------------------------------

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopShop",
  description: "Shopping List Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  logger.info({
    context: "RootLayout",
    session: session,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          //inter.className,
          GeistSans.className,
          "bg-indigo-50 dark:bg-indigo-800",
          "text-black dark:text-white",
        )}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="shopshop-theme"
        >
          <SessionProvider session={session}>
            <ModalProvider />
            <LayoutHeader />
            <div className="h-full">
              {session?.user ? (
                <div className="fixed hidden h-full w-[72px] flex-col md:flex">
                  <LayoutSidebar />
                </div>
              ) : null}
              <main className="h-full md:pl-[72px]">{children}</main>
            </div>
            <LayoutFooter />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
