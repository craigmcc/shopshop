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
//import { logger } from "@/lib/ClientLogger";

// Public Objects ------------------------------------------------------------

export function SignOutForm() {

  const router = useRouter();

  async function performSignOut() {
/*
    await doSignOut();
    logger.info({
      context: "SignOutForm.performSignOut",
      message: "Successful sign out",
    });
*/
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center sm:px-8">
      <h5>Are you sure you want to sign out?</h5>
      <form action={performSignOut}>
{/*
        <Button
          title="Sign Out"
          type="submit"
          variant="default"
        >
          Sign Out
        </Button>
*/}
      </form>
    </div>
  )

}
