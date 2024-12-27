// @/components/shared/MessageBox.tsx

/**
 * Generic message box supporting different display types.
 *
 * @packageDocumentation
 */

// Public Objects ------------------------------------------------------------

export type MessageBoxProps = {
  content: React.ReactNode,
  type: "success" | "error",
}

export default function MessageBox (props: MessageBoxProps) {
  return (
    <div className={`bg-accent px-4 py-2 my-2 rounded-lg ${props.type === 'error' ? 'text-red-500' : ''}`}>
      {props.type === 'success' ? '🎉' : '🚨'} {props.content}
    </div>
  )
}

