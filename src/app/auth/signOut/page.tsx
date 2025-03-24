// @/app/auth/signOut/page.tsx

/**
 * Sign out after confirmation
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import { SignOutForm } from "@/components/auth/SignOutForm";
import { SubHeader } from "@/components/layout/SubHeader";

// Public Objects ------------------------------------------------------------

export default function SignOutPage() {

  return (
      <main className="flex w-full items-center justify-center h-[calc(100vh-80px)] p-4">
        <div className="flex flex-col">
          <SubHeader
            hrefBack="/lists"
            title="Sign Out"
          />
          <SignOutForm/>
        </div>
      </main>
  )
}
