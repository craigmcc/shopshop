// @/app/(auth)/signUp/page.tsx

/**
 * Sign up to create a new profile page.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import SignUpForm from "@/components/forms/SignUpForm";

// Public Objects ------------------------------------------------------------

export default function SignUpPage() {
  return (
    <div>
      <main>
        <SignUpForm />
      </main>
    </div>
  )
}
