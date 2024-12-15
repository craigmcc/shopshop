// @/app/api/auth/[...nextauth]/route.ts

/**
 * API endpoints for auth.js server interactions.
 *
 * @packageDocumentation
 */

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
