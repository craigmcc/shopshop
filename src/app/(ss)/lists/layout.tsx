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
    <div className="flex flex-row gap-2">
      <div className="h-full w-60 border-r-2 border-gray-500">
        <ListsSidebar />
      </div>
      <main className="flex h-full w-full items-center justify-center p-4">
        {props.children}
      </main>
    </div>
  );
}
/*
export default async function ListsLayout(props: Props) {

  return (
    <div className="flex flex-row gap-2">
      <div className="h-full w-60 border-r-4">
        <ListsSidebar />
      </div>
      <main className="h-full">{props.children}</main>
    </div>
  )

}
*/
