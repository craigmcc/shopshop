// @/app/(auth)/lists/page.tsx

/**
 * Enumerate the actions that can be taken to manage shopping lists.
 * Successful sign ins will be redirected to this page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export default function ListsPage() {
  return (
    <div className="flex flex-col justify-center text-center max-w-5xl mx-auto h-dvh gap-6">
      <h1 className="text-5xl">Shopping List Management</h1>
      <div>Select one of the following options:</div>
      <ul>
        <li>Click on the &apos;plus&apos; icon to add a new list. </li>
        <li>Click on the name of a list to enter items on that list.</li>
        <li>Click on the &apos;...&apos; icon to open a menu of available options.</li>
      </ul>
    </div>
  )
}
