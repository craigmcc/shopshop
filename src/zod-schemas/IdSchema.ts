// @/zod-schemas/IdSchema.ts

/**
 * Zod schema for generic IDs.
 *
 * @packageDocumentation
 */

// ExternalModules ----------------------------------------------------------

import { string } from "zod";

// Public Objects ------------------------------------------------------------

export const IdSchema = string().uuid("Invalid object ID");

export type IdSchemaType = typeof IdSchema._type;
