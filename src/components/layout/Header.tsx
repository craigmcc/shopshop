// @/components/layout/Header.tsx

/**
 * Navigation bar for the global layout of this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { AlignJustify } from "lucide-react";
import { SignedInMenu } from "@/components/layout/SignedInMenu";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

// Public Objects ------------------------------------------------------------

export async function Header() {

  const session = await auth();

  return (
    <div className="navbar justify-between mb-2 px-2 py-2 items-center bg-base-200">
      <div className="flex flex-row">
        <Link href="/" className="mr-2">
          <AlignJustify/>
        </Link>
        <Link href="/">
          <span className="font-semibold">ShopShop</span>
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        {session?.user?.email ? (
          <SignedInMenu />
        ) : null }
        <ThemeSwitcher />
      </div>
    </div>
  )
}
