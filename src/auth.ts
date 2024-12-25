// @/auth.ts

/**
 * Configuration for authjs (née next-auth) 5 beta.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/encryption";
import { logger } from "@/lib/ServerLogger";
import { signInSchemaType } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

/**
 * Authentication options for auth.js.
 *
 * @packageDocumentation
 */

export const { auth, handlers, signIn, signOut } = NextAuth({

  pages: {
    signIn: "/logIn",
    signOut: "/logOut",
  },

  providers: [

    CredentialsProvider({

      // @ts-expect-error ESLint does not like the type of credentials
      async authorize(credentials: signInSchemaType) {
        logger.info({
          context: "auth.authorize",
          credentials: {
            ...credentials,
            password: "*REDACTED*",
          },
        });
        const profile = await db.profile.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (profile) {
          if (await verifyPassword(credentials.password, profile.password)) {
            profile.password = ""; // Redact the hashed password
            return {
              email: profile.email,
              image: profile.imageUrl,
              name: profile.name,
              profile: profile,
            };
          } else {
            return null;
          }
        } else {
//          throw new Error("Invalid credentials");
          return null;
        }

      },

      credentials: {
        email: { label: "Email Address", type: "text" },
        password: { label: "Password", type: "password" },
      },

      name: "Credentials",

    }),

  ],

  session: {
    strategy: "jwt",
  },

});
