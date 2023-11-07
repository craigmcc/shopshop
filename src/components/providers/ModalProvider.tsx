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
import {ListFormModal} from "@/components/lists/ListFormModal";
import {ListLeaveModal} from "@/components/lists/ListLeaveModal";
import {ListRemoveModal} from "@/components/lists/ListRemoveModal";

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
            <ListLeaveModal/>
            <ListRemoveModal/>
        </>
    )

}
