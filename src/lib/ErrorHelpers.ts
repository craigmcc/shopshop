// NOTE: *Not* a "use server" file to prevent methods from being server actions

// @/lib/ErrorHelpers.ts

/**
 * Errors that can be thrown by the database (or Zod schema validation) etc.
 * and returned to the client.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { ZodError } from "zod";

// Public Objects ------------------------------------------------------------

/**
 * Generic database error that can be specialized further.
 */
export class ErrorHelper extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErrorHelper";
  }
}

/**
 * Error describing a foreign key constraint violation.
 * For Prisma, this will be code P2003.
 */
export class ForeignKeyError extends ErrorHelper {
  constructor(message: string) {
    super(message);
    this.name = "ForeignKeyError";
  }
}

/**
 * Error describing the Profile not being authorized to perform this action.
 */
export class NotAuthorizedError extends ErrorHelper {
  constructor(message?: string) {
    super(message ? message : "This Profile is not authorized to perform this action");
    this.name = "NotAuthorizedError";
  }
}

/**
 * Error describing the Profile not being signed in.
 */
export class NotAuthenticatedError extends ErrorHelper {
  constructor(message?: string) {
    super(message ? message : "This Profile is not signed in");
    this.name = "NotAuthenticatedError";
  }
}

/**
 * Error describing a record not found.
 */
export class NotFoundError extends ErrorHelper {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Error describing a null constraint violation.
 * For Prisma this will be code P2011.
 */
export class NullConstraintError extends ErrorHelper {
  constructor(message: string) {
    super(message);
    this.name = "NullConstraintError";
  }
}

/**
 * Error describing a uniqueness constraint violation.
 * For Prisma this will be code P2002.
 */
export class UniqueConstraintError extends ErrorHelper {
  constructor(message: string) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}

/**
 * Error describing validation error(s) discovered on the server side.
 */
export class ValidationError extends ErrorHelper {

  fieldErrors = {};
  formErrors = {};

  constructor(error: ZodError, message?: string) {
    super(message ? message : error.message);
    const flattened = error.flatten();
    this.fieldErrors = flattened.fieldErrors || {};
    this.formErrors = flattened.formErrors || {};
  }

}
