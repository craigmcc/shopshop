// @/components/layout/Header.tsx

/**
 * Navigation bar for the global layout of this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import { AlignJustify } from "lucide-react";
import { SignedInMenu } from "@/components/layout/SignedInMenu";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { findProfile } from "@/lib/ProfileHelpers";

// Public Objects ------------------------------------------------------------

export async function Header() {

  const profile = await findProfile();

  return (
    <div className="navbar justify-between items-center bg-base-200">
      <div className="flex flex-row">
        <Link href="/" className="mr-2">
          <AlignJustify/>
        </Link>
        <Link href="/">
          <span className="font-semibold">ShopShop</span>
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        {profile && <SignedInMenu profile={profile}/>}
        <ThemeSwitcher />
      </div>
    </div>
  )
}
