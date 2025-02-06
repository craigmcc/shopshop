"use server";

// @/actions/DummyActions.ts

/**
 * Dummy server action to verify testability.
 *
 * @packageDocumentation
 */

// Public Objects ------------------------------------------------------------

export async function doAdd(a: number, b: number) {
  return a + b;
}

export async function doSubtract(a: number, b: number) {
  return a - b;
}

