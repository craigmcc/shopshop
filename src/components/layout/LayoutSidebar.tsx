// @/components/layout/LayoutHeader.tsx

/**
 * Side-of-layout menu bar for the global layout.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const LayoutSidebar = () => {

    return (
        <aside
            className="hidden md:flex h-full w-[72px] flex-col fixed bg-indigo-200 dark:bg-indigo-800"
        >
            <p>Layout Sidebar with some extra height</p>
        </aside>
    )

}
