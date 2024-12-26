// @/app/page.tsx

/**
 * Home page for the application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { GitBranchPlus, Key } from "lucide-react";
import Link from 'next/link';

// Internal Modules ----------------------------------------------------------

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <main>
        <div className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh gap-6">
          <h1 className="text-5xl">Welcome to ShopShop</h1>
          <h2 className="text-3xl">Your electronic shopping list!</h2>
          <div className="flex flex-row justify-center text-center gap-6">
            <Button
              aria-label="Sign In"
              asChild
              className="rounded-full"
              title="Sign In"
              variant="default"
            >
              <Link href="/auth/signIn">
                <Key />&nbsp;Sign In
              </Link>
            </Button>
            <Button
              aria-label="Sign Up"
              asChild
              className="rounded-full"
              title="Sign Up"
              variant="default"
            >
              <Link href="/auth/signUp">
                <GitBranchPlus />&nbsp;Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>

  );
}
