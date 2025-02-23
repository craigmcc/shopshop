// @/app/(ss)/profile/layout.tsx

/**
 * Layout for the Profile page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
    children: React.ReactNode;
}

export default async function ProfileLayout(props: Props) {
    return (
        <div className="flex flex-row gap-2">
            <main className="flex h-[calc(100vh-80px)] w-full items-center justify-center p-4">
                {props.children}
            </main>
        </div>
    );
}
