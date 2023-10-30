// @/components/layout/LayoutHeader.tsx

/**
 * Side-of-layout menu bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {getServerSession} from "next-auth";

// Internal Modules ----------------------------------------------------------

import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {Separator} from "@/components/ui/separator";
import {logger} from "@/lib/ServerLogger";

// Public Objects ------------------------------------------------------------

export async function LayoutSidebar() {

    const session = await getServerSession(authOptions);
    logger.info({
        context: "LayoutSidebar",
        session: session,
    });
    const profile = session?.user.profile;
    logger.info({
        context: "LayoutSidebar2",
        profile: profile,
    });

    return (
        <aside
            className="hidden md:flex h-full w-[72px] flex-col fixed bg-indigo-200 dark:bg-indigo-800"
        >
            {session?.user.profile ? (
                <>
                    <div>{session?.user.profile.name}</div>
                    <div>{session?.user.profile.scope}</div>
                </>
            ) : (
                <div>Not Signed In</div>
            )}
            <Separator
                className="h-[2px] bg-yellow-600 rounded-md"
            />
            <p>Layout Sidebar with some extra height</p>
        </aside>
    )

}

export default LayoutSidebar;
