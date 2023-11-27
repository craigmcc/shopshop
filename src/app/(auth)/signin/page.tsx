// @app/(auth)/signin/page.tsx

/**
 * Authentication sign-in page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "@/components/auth/SignInForm";

// Public Objects ------------------------------------------------------------

export default async function SignInPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return <SignInForm />;
}
