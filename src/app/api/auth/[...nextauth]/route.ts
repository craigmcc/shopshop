// @/app/api/[...next-auth]/route.ts

/**
 * API route for next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import NextAuth from "next-auth";

// Internal Modules ----------------------------------------------------------

import { authOptions } from "./authOptions";

// Public Objects ------------------------------------------------------------

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
