// @/components/layout/LayoutHeader.tsx

/**
 * Side-of-layout menu bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {redirect} from "next/navigation";

// Internal Modules ----------------------------------------------------------

import * as ListActions from "@/actions/ListActions";
import {ListCreateItem} from "@/components/lists/ListCreateItem";
import {ListSelectItem} from "@/components/lists/ListSelectItem";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {currentProfile} from "@/lib/currentProfile";

// Public Objects ------------------------------------------------------------

export async function LayoutSidebar() {

    const profile = await currentProfile();
    if (!profile) {
        return null;
    }
    const lists = await ListActions.all(profile.id);

    return (
        <aside
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
        >
            <div className="w-full">
                <ListCreateItem/>
            </div>
            <Separator
                className="h-[2px] bg-yellow-600 rounded-md"
            />
            <ScrollArea className="flex-1 w-full">
                {lists.map((list) => (
                    <div key={list.id} className="pb-4">
                        <ListSelectItem list={list}/>
                    </div>
                ))}
            </ScrollArea>

        </aside>
    )

}

export default LayoutSidebar;
