"use client"

// @/components/layout/LayoutHeader.tsx

/**
 * Top-of-layout header bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {signIn, useSession} from "next-auth/react";

// Internal Modules ----------------------------------------------------------

import {ModeToggle} from "@/components/layout/ModeToggle";
import {ProfileMenu} from "@/components/profiles/ProfileMenu";
import {Button} from "@/components/ui/button";
import {ModalType, useModalStore} from "@/hooks/useModalStore";

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
                <SignUpButton/>
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
                <ProfileMenu profile={session.user.profile}/>
            </>
        );
    }
    return (
        <>
            <Button onClick={() => signIn()}>Sign In</Button>
        </>
    );
}

function SignUpButton() {

    const {data: session} = useSession();
    const {onOpen} = useModalStore();
    if (session) {
        return null;
    }

    return (
        <Button onClick={() => onOpen(ModalType.PROFILE_SIGNUP, {})}>
            Sign Up
        </Button>
    )

}
