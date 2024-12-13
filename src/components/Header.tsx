// @/components/Header.tsx

import { AlignJustify, /*File,*/ /*LogOut,*/ /*UsersRound*/ } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/ModeToggle";
import { NavButton } from "@/components/NavButton";
// import { NavButtonMenu}  from "@/components/NavButtonMenu";
// import { Button } from "@/components/ui/button";
// import { LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

export function Header() {
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

{/*
          <NavButton href="/tickets" icon={File} label="Tickets"/>
*/}

{/*
          <NavButtonMenu
            icon={UsersRound}
            label="Customers Menu"
            choices={[
              { title: "Search Customers", href: "/customers" },
              { title: "New Customer", href: "/customers/form" }
            ]}
          />
*/}

          <ModeToggle />

{/*
          <Button
            aria-label="LogOut"
            asChild
            className="rounded-full"
            size="icon"
            title="LogOut"
            variant="ghost"
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
*/}
        </div>

      </div>
    </header>
  )
}
