// @/app/(ss)/lists/layout.tsx

/**
 * Layout for lists sidebar and a variety of other pages next to it.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { ListsSidebar } from "@/components/lists/ListsSidebar";

// Public Objects ------------------------------------------------------------

type Props = {
  children: React.ReactNode;
}

export default async function ListsLayout(props: Props) {
  return (
    <div className="flex flex-row h-[calc(100vh-80px)] gap-2">
      <div className="w-60 border-r-2 border-gray-500">
        <ListsSidebar />
      </div>
      <main className="flex w-full items-center justify-center p-4">
        {props.children}
      </main>
    </div>
  );
}
