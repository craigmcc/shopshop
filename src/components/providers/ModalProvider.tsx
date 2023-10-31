"use client"
// @/components/providers/ModalProvider.tsx

/**
 * Component to work around hydration errors on modal components by
 * deferring navigation on them until needed.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";
import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

// TODO - imports of components that are modals go here.
import {ListInsertModal} from "@/components/lists/ListInsertModal";

// Public Objects ------------------------------------------------------------

export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    // TODO - check for authenticated Profile?  (not for SignInModal or HomePage)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* TODO - instantiations of modal components go here */}
            <ListInsertModal/>
        </>
    )

}
