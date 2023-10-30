// @/components/layout/LayoutHeader.tsx

/**
 * Side-of-layout menu bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth";

// Internal Modules ----------------------------------------------------------

import {Separator} from "@/components/ui/separator";

// Public Objects ------------------------------------------------------------

export async function LayoutSidebar() {

    const session = await getServerSession();

    return (
        <aside
            className="hidden md:flex h-full w-[72px] flex-col fixed bg-indigo-200 dark:bg-indigo-800"
        >
            {session?.user?.name ? (
                <div>{session.user?.name}</div>
            ) : (
                <div>Not Logged In</div>
            )}
            <Separator
                className="h-[2px] bg-yellow-600 rounded-md"
            />
            <p>Layout Sidebar with some extra height</p>
        </aside>
    )

}

export default LayoutSidebar;
