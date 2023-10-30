// @/app/api/[...next-auth]/route.ts

/**
 * API route for next-auth.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
