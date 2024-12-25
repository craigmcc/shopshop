// @/lib/strings.ts

/**
 * Generic utility functions for manipulating strings.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Parse the specified words string and return a sequence of initials
 * composed of the (capitalized) first letter of each word.
 *
 * @param value                         String of words to be parsed
 */
export const initials = (value: string): string => {
  const words = value.split(" ");
  const results: string[] = [];
  for (const word of words) {
    results.push(word.charAt(0).toUpperCase());
  }
  return results.join("");
};
