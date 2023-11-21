"use client"
// @/components/providers/ModalProvider.tsx

/**
 * Component to work around hydration errors on modal components by
 * deferring navigation on them until needed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

// TODO - imports of components that are modals go here.
import {SignUpModal} from "@/components/auth/SignUpModal";
import {ListFormModal} from "@/components/lists/ListFormModal";
import {ListInviteModal} from "@/components/lists/ListInviteModal";
import {ListLeaveModal} from "@/components/lists/ListLeaveModal";
import {ListMembersModal} from "@/components/lists/ListMembersModal";
import {ListRemoveModal} from "@/components/lists/ListRemoveModal";
import {ProfilePasswordModal} from "@/components/profiles/ProfilePasswordModal";
import {ProfileUpdateModal} from "@/components/profiles/ProfileUpdateModal";

// Public Objects ------------------------------------------------------------

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* TODO - instantiations of modal components go here */}
            <ListFormModal/>
            <ListInviteModal/>
            <ListLeaveModal/>
            <ListMembersModal/>
            <ListRemoveModal/>
            <ProfilePasswordModal/>
            <ProfileUpdateModal/>
            <SignUpModal/>
        </>
    )

}
