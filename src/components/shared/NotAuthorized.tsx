"use client";
// @/components/shared/NotAuthorized.tsx

/**
 * Display a dialog indicating that a user is signed in, but has not been
 * granted authorization to perform this function.  After "OK" is clicked,
 * redirect the user to the "/select" page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Link from "next/link";

// Internal Modules ----------------------------------------------------------

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Public Objects ------------------------------------------------------------

export type NotAuthorizedProps = {
  // Optional message to be displayed [generic "not authorized" message]
  message?: string;
};

export function NotAuthorized(props: NotAuthorizedProps) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Not Authorized</AlertDialogTitle>
          <AlertDialogDescription>
            {props.message ? (
              <p>{props.message}</p>
            ) : (
              <p>You have not been permitted access to this function.</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link href="/">OK</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
