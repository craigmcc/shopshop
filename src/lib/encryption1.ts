// @/lib/encryption.ts

/**
 * General utilities for encrypting and verifying passwords
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Perform a one-way hash on the specified password, and return the result
 * as a string.
 *
 * @param password      Plain-text password to be hashed
 */
export const hashPassword = async (password: string): Promise<string> => {
  return generateHash(password);
};

/**
 * Verify that the specified plain-text password hashes to the specified
 * hash value.
 *
 * @param password      Plain-text password to be checked
 * @param hash          Hashed password previously calculated by hashPassword()
 */
export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return (await generateHash(password)) === hash;
};

// Private Objects -----------------------------------------------------------

/**
 * Edge-compatible way to generate hashes.
 *
 * https://www.google.com/search?q=replace+crypto+for+edge+nextjs+runtime&sca_esv=0c3a6d1f3aa5848b&sxsrf=ADLYWILcUOzoz0JB-tLtFq6L2EsO2o6APA%3A1734229502608&ei=_j1eZ6fsJPni0PEPurmm-QQ&ved=0ahUKEwin49ir3KiKAxV5MTQIHbqcKU8Q4dUDCBA&uact=5&oq=replace+crypto+for+edge+nextjs+runtime&gs_lp=Egxnd3Mtd2l6LXNlcnAiJnJlcGxhY2UgY3J5cHRvIGZvciBlZGdlIG5leHRqcyBydW50aW1lMgcQIRigARgKMgcQIRigARgKMgcQIRigARgKMgcQIRigARgKMgcQIRigARgKMgUQIRifBUj1J1DJBliOJnABeAGQAQCYAXigAf8FqgEDNi4yuAEDyAEA-AEBmAIJoAKjBsICChAAGLADGNYEGEfCAgUQIRigAcICBRAhGKsCmAMAiAYBkAYIkgcDNi4zoAfZKA&sclient=gws-wiz-serp
 */
async function generateHash(data: string) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
