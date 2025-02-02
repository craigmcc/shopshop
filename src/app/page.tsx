// @/app/page.tsx

/**
 * Home page for this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { GitBranchPlus, Key } from "lucide-react"
import Link from "next/link";

// Public Objects ------------------------------------------------------------

export default function Home() {
  return (
    <div>
      <main>
        <div className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh gap-6">
          <h1 className="text-5xl">Welcome to ShopShop</h1>
          <h2 className="text-3xl">Your electronic shopping list!</h2>
          <div className="flex flex-row justify-center text-center gap-6">
            <button className="btn btn-info">
              <Link className="flex flex-row gap-2" href="/auth/signUp">
                <GitBranchPlus /><span>Sign Up</span>
              </Link>
            </button>
            <button className="btn btn-primary">
              <Link className="flex flex-row gap-2" href="/auth/signIn">
                <Key /><span>Sign In</span>
              </Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
