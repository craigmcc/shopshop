// @/app/layout.tsx

/**
 * Global application layout.
 *
 * @packageDocumentation
 */

import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from '@/components/ui/toaster'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "ShopShop",
    template: "%s | ShopShop",
  },
  description: "Shopping List App",
  applicationName: "shopshop",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="mx-auto w-full max-w-7xl">
        <Header/>
        <div className="px-4 py-2">
          {children}
        </div>
      </div>
      <Toaster/>
    </ThemeProvider>
    </body>
    </html>
  );
}
