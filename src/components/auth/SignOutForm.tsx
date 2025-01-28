// @/components/auth/SignOutForm.tsx

"use client"

/**
 * Form for the Sign Out page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";

// Internal Modules ----------------------------------------------------------

//import { doSignOut } from "@/actions/authActions";
//import { Button } from "@/components/ui/button";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export function SignOutForm() {

  const router = useRouter();

  async function submitForm() {
    logger.info({
      context: "SignOutForm.submitForm",
      message: "Performing sign out",
    })
/*
    await doSignOut();
*/
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center sm:px-8">
      <h5>Are you sure you want to sign out?</h5>
      <form action={submitForm}>
        <button
          className="btn btn-primary"
          type="submit"
        >
          Sign Out
        </button>
      </form>
    </div>
  )

}
