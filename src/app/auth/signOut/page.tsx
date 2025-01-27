// @/app/auth/signOut/page.tsx

/**
 * Sign out after confirmation
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import { SignOutForm } from "@/components/auth/SignOutForm";

// Public Objects ------------------------------------------------------------

export default function SignOutPage() {

  return (
    <div>
      <main>
        <div className="flex flex-col  max-w-5xl mx-auto h-dvh">
          <SignOutForm/>
        </div>
      </main>
    </div>
  )
}
