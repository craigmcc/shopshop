// @/app/(auth)/signUp/page.tsx

/**
 * Sign up to authenticate an existing profile.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import SignInForm from "@/components/forms/SignInForm";

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
