// @/app/layout.tsx

/**
 * Overall layout for the entire application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {getServerSession} from "next-auth";

// Internal Modules ----------------------------------------------------------

import "./globals.css";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {LayoutFooter} from "@/components/layout/LayoutFooter";
import {LayoutHeader} from "@/components/layout/LayoutHeader";
import {LayoutSidebar} from "@/components/layout/LayoutSidebar";
import {ModalProvider} from "@/components/providers/ModalProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import {ThemeProvider} from "@/components/providers/ThemeProvider";
import {logger} from "@/lib/ServerLogger";
import {cn} from "@/lib/utils";

// Public Objects ------------------------------------------------------------

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "ShopShop",
    description: "Shoppping List Application",
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
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
                inter.className,
                "bg-indigo-50 dark:bg-indigo-950",
                "text-black dark:text-white"
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
                <LayoutHeader/>
                {/*<ModalProvider/>*/}
                <div className="h-full">
                    {(session?.user) ? (
                        <LayoutSidebar/>
                    ) : null }
                    <main className="md:pl-[72px] h-full">
                        {children}
                    </main>
                </div>
                <LayoutFooter/>
            </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
