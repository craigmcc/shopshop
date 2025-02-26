// @/lib/ActionResult.ts

/**
 * The result of an action that may return a value or an error (or both).
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { ZodError } from "zod";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * The result of an action that may return an error message or a model object
 * (or both).  For cases where the action failed because of schema validation
 * issues, a set of form errors (individual strings) global to the entire
 * result, and/or a set of field errors (keyed by field name) specific to
 *
 * @param M                             The type of model object being returned
 */
export type ActionResult<M> = {
  // Field errors (if any) keyed by field name (based on ZodError flattened)
  fieldErrors?: {
    [p: string]: string[] | undefined;
    [p: number]: string[] | undefined;
    [p: symbol]: string[] | undefined
  } | undefined;
  // Form errors (if any) global to the entire result (based on ZodError flattened
  formErrors?: string[] | undefined;
  // Message describing the error that occurred (if any)
  message?: string | undefined;
  // The model object returned by the action (if any)
  model?: M | undefined;
}

/**
 * Shortcut for an ActionResult that returns validation errors.
 *
 * @param M                             The type of model object being returned
 * @param error                         The ZodError that caused the failure
 * @param message                       Optional message to include in the result
 */
export function ValidationActionResult<M>(error: ZodError, message?: string): ActionResult<M> {
  const flattened = error.flatten();
  return {
    fieldErrors: flattened.fieldErrors || undefined,
    formErrors: flattened.formErrors || undefined,
    message: message ? message : "Request data does not pass validation",
  }
}
