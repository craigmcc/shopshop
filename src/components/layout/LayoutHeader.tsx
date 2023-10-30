"use client"

// @/components/layout/LayoutHeader.tsx

/**
 * Top-of-layout header bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {signIn, signOut, useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import {ModeToggle} from "@/components/layout/ModeToggle";
import {Button} from "@/components/ui/button";

// Public Objects ------------------------------------------------------------

export const LayoutHeader = () => {

    return (
        <header
            className="bg-indigo-100 dark:bg-indigo-900 flex h-[50px] w-full"
            suppressHydrationWarning
        >
            <div className="flex flex-1 items-center justify-center" suppressHydrationWarning>
                LayoutHeader
            </div>
            <div
                className="flex flex-1 items-center justify-end space-x-2"
                suppressHydrationWarning
            >
                <AuthButton/>
                <ModeToggle/>
            </div>
        </header>
    )

}

function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <span>{session?.user?.name}</span>
                <Button onClick={() => signOut()}>Sign out</Button>
            </>
        );
    }
    return (
        <>
            <span>Not signed in</span>
            <Button onClick={() => signIn()}>Sign in</Button>
        </>
    );
}

