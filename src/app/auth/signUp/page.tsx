// @/app/auth/signUp/page.tsx

/**
 * Sign up to create a new profile page.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import { SignUpForm } from "@/components/auth/SignUpForm";

// Public Objects ------------------------------------------------------------

export default function SignUpPage() {
  return (
    <div>
      <main>
        <div className="flex flex-col  max-w-3xl mx-auto h-dvh">
          <SignUpForm />
        </div>
      </main>
    </div>
  )
}
