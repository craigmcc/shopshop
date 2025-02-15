"use client";

// @/components/shared/ServerResponse.tsx

/**
 * Display the response from a server action, as follows:
 * - If the response is a string, display it in an accent style as "success".
 * - If the response is an Error message, display it in an error style.
 * - If the response is a ValidationError object, display each error in an error style.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { logger } from "@/lib/ClientLogger";
import { ValidationError } from "@/lib/ErrorHelpers";

// Public Objects ------------------------------------------------------------

type Props = {
  result: string | Error | ValidationError
}

export function ServerResponse(response: Props ) {

  logger.trace({
    context: "ServerResponse",
    result: response.result,
  });

  if (typeof response.result  === "string") {
    return (
      <div className="bg-accent text-accent-content px-4 py-2 my-2 rounded-lg">
        {response.result}
      </div>
    );
  } else if (response.result instanceof ValidationError) {
    return (
      <div className="bg-error px-4 py-2 my-2 rounded">
        <div>{response.result.message}</div>
        <ul>
          {response.result.formErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
        {response.result.fieldErrors && (
          <ul>
            {Object.entries(response.result.fieldErrors).map(([field, errors]) => {
                return (
                  errors && (
                    <li className="bg-error" key={field}>
                      {field}: {errors.join(", ")}
                    </li>
                  )
                )
              }
            )}
          </ul>
        )}
      </div>
    );
  } else {
    return (
      <div className="bg-error text-error-content px-4 py-2 my-2 rounded">
        {response.result.message}
      </div>
    );
  }

}
