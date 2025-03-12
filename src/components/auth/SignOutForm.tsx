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

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

export function SignOutForm() {

  const router = useRouter();

  async function submitForm() {
    logger.trace({
      context: "SignOutForm.submitForm",
      message: "Performing sign out",
    })
    await doSignOutAction();
    logger.trace({
      context: "SignOutForm.submitForm.success",
      message: "Sign out successful",
    });
    toast("Sign out successful", {
      type: "success",
    });
    if (!isTesting) {
      router.push("/");
    }
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
