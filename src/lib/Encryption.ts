// @/lib/Encryption.ts

/**
 * General utilities for encrypting and verifying passwords
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import {
  hashSync,
  compareSync,
} from 'bcrypt-edge';

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Perform a one-way hash on the specified password, and return the result
 * as a string.
 *
 * @param password      Plain-text password to be hashed
 */
export const hashPassword = (password: string): string => {
  return generateHash(password);
};

/**
 * Verify that the specified plain-text password hashes to the specified
 * hash value.
 *
 * @param password      Plain-text password to be checked
 * @param hash          Hashed password previously calculated by hashPassword()
 */
export const verifyPassword = (
  password: string,
  hash: string,
): boolean => {
//  return (await generateHash(password)) === hash;
  return compareSync(password, hash);
};

// Private Objects -----------------------------------------------------------

/**
 * Edge-compatible way to generate hashes.
 */
function generateHash(data: string) {
  return hashSync(data, 10); // Salt for this many rounds

}
