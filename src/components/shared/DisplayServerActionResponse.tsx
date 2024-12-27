// @/components/shared/DisplayServerActionResponse.tsx

// Component Properties ------------------------------------------------------

export type DisplayServerActionResponseProps = {
    result: {
        data?: {
            message?: string,
        },
        serverError?: string,
        validationErrors?: Record<string, string[] | undefined>,
    },
}

// Public Objects ------------------------------------------------------------

export function DisplayServerActionResponse({ result }: DisplayServerActionResponseProps) {

    const { data, serverError, validationErrors } = result

    return (
        <div>
            {data?.message && (
                <MessageBox type="success" content={`Success: ${data.message}`} />
            )}

            {serverError && (
                <MessageBox type="error" content={serverError} />
            )}

            {validationErrors && (
                <MessageBox
                    type="error"
                    content={Object.keys(validationErrors).map(key => (
                        <p key={key}>{`${key}: ${validationErrors[key as keyof typeof validationErrors]}`}</p>
                    ))}
                />
            )}
        </div>
    )
}

// Private Objects -----------------------------------------------------------

const MessageBox = ({
                        type,
                        content,
                    }: {
    type: 'success' | 'error',
    content: React.ReactNode,
}) => (
  <div className={`bg-accent px-4 py-2 my-2 rounded-lg ${type === 'error' ? 'text-red-500' : ''}`}>
      {type === 'success' ? '🎉' : '🚨'} {content}
  </div>
)

