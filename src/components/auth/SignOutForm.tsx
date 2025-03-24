"use client";

// @/components/auth/SignOutForm.tsx

/**
 * Form for the Sign Out page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignOutAction } from "@/actions/AuthActions";
import { ActionResult } from "@/lib/ActionResult";
import { logger } from "@/lib/ClientLogger";
import { ServerResult } from "@/components/shared/ServerResult";
import {LoaderCircle} from "lucide-react";

const isTesting = process.env.NODE_ENV === "test";

// Public Objects ------------------------------------------------------------

export function SignOutForm() {

  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [result, setResult] = useState<ActionResult<Profile> | null>(null);

  async function performSignOut() {

    logger.trace({
      context: "SignOutForm.performSignOut.input",
      message: "Performing sign out",
    })

    try {

      setIsSigningOut(true);
      await doSignOutAction();
      logger.trace({
        context: "SignOutForm.submitForm.success",
        message: "Sign out successful",
      });
      setIsSigningOut(false);

      toast.success("Sign out successful");
      if (isTesting) {
        setResult({message: "Success"});
      } else {
        router.push("/");
      }

    } catch (error) {

      setIsSigningOut(false);
      logger.trace({
        context: "SignOutForm.submitForm.error",
        error,
      });
      setResult({message: (error as Error).message})

    }

  }

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">
          <ServerResult result={result}/>
        </h2>
      </div>
      <div className="gap-2">
        <h5>
          Are you sure you want to sign out?
        </h5>
        <button
          className="btn btn-primary justify-center"
          onClick={performSignOut}
          type="button"
        >
          {isSigningOut ? (
            <>
              <LoaderCircle className="animate-spin"/>Signing Out
            </>
          ): "Sign Out" }
        </button>
      </div>
    </div>
  )

}
