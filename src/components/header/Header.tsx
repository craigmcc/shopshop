// @/components/header/Header.tsx

/**
 * Page header component.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { AlignJustify, /*File,*/ /*LogOut,*/ UserRound } from "lucide-react";
import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import { auth } from "@/auth";
import { ModeToggle } from "@/components/header/ModeToggle";
import { NavButton } from "@/components/header/NavButton";
import { NavButtonMenu}  from "@/components/header/NavButtonMenu";
import { initials } from "@/lib/strings";

// Public Objects ------------------------------------------------------------

export async function Header() {

  const session = await auth();
//  console.log("Session: ", session);

  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20">
      <div className="flex h-8 items-centered justify-between w-full">

        <div className="flex items-center gap-2">
          <NavButton href="/" icon={AlignJustify} label="Home"/>
          <Link href="/" className="flex justify-center items-center gap-2 ml-0" title="Home">
            <h1 className="hidden sm:block txt-xl font-bold m-0 mt-1">
              ShopShop
            </h1>
          </Link>
        </div>

        <div className="flex items-center">
          {session?.user.name ? (
            <NavButtonMenu
              choices={[
                { title: "Edit Profile", href: "/profile" },
                { title: "Sign Out", href: "/logOut" },
              ]}
              icon={UserRound}
              label={initials(session.user.name)}
            />
          ) : null }
          <ModeToggle />
        </div>

      </div>
    </header>
  )

}
