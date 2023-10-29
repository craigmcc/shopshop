// @/components/layout/LayoutHeader.tsx

/**
 * Top-of-layout header bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import {ModeToggle} from "@/components/layout/ModeToggle";

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
            <div className="flex flex-1 items-center justify-end p-2" suppressHydrationWarning>
                <ModeToggle/>
            </div>
        </header>
    )

}
