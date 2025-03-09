"use client";

// @/components/auth/SignOutForm.tsx

/**
 * Form for the Sign Out page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignOutAction } from "@/actions/AuthActions";
import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export function SignOutForm() {

  const router = useRouter();

  async function submitForm() {
    logger.trace({
      context: "SignOutForm.submitForm",
      message: "Performing sign out",
    })
    await doSignOutAction();
    toast("Sign out successful", {
      type: "success",
    });
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
