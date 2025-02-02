// @/errors/DatabaseErrors.ts

/**
 * Errors that can be thrown by the database (or Zod schema validation)
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
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * Error describing a foreign key constraint violation.
 * For Prisma, this will be code P2003.
 */
export class ForeignKeyConstraintViolation extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "ForeignKeyConstraintViolation";
  }
}

/**
 * Error describing a null constraint violation.
 * For Prisma this will be code P2011.
 */
export class NullConstraintViolation extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "NullConstraintViolation";
  }
}

/**
 * Error describing a uniqueness constraint violation.
 * For Prisma this will be code P2002.
 */
export class UniqueConstraintViolation extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "UniqueConstraintViolation";
  }
}

/**
 * Error describing validation error(s) discovered on the server side.
 */
export class ValidationViolation extends DatabaseError {

  fieldErrors = {};
  formErrors = {};

  constructor(error: ZodError) {
    super(error.message);
    const flattened = error.flatten();
    this.fieldErrors = flattened.fieldErrors || {};
    this.formErrors = flattened.formErrors || {};
  }

}
