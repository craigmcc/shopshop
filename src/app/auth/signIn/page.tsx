// @/app/auth/signIn/page.tsx

/**
 * Sign in with a registered email address and password.
 *
 * @packageDocumentation
 */

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "@/components/auth/SignInForm";
import { SubHeader } from "@/components/layout/SubHeader";

// Public Objects ------------------------------------------------------------

export default function SignInPage() {
  return (
    <main className="flex w-full items-center justify-center h-[calc(100vh-80px)] p-4">
        <div className="flex flex-col">
          <SubHeader
            hrefBack="/"
            title="Sign In to ShopShop"
          />
          <SignInForm/>
        </div>
      </main>
  )
}
