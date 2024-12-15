// @/app/template.tsx

/**
 * Template to provide animation for the header bar.
 *
 * @packageDocumentation
 */

export default async function Template({
                                         children,
                                       }: {
  children:  React.ReactNode,
}) {

  return (
    <div className="animate-appear">
      {children}
    </div>
  )

}
