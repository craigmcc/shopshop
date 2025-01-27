// @/app/auth/signIn/page.tsx

/**
 * Sign in with a registered email address and password.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "@/components/auth/SignInForm";

// Public Objects ------------------------------------------------------------

export default function SignInPage() {
  return (
    <div>
      <main>
        <div className="flex flex-col  max-w-5xl mx-auto h-dvh">
          <SignInForm/>
        </div>
      </main>
    </div>
  )
}
