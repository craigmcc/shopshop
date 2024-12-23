// @/auth.ts

/**
 * Configuration for authjs (née next-auth) 5 beta.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import Credentials from "@auth/core/providers/credentials";
import NextAuth from "next-auth";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/encryption";
import { logger } from "@/lib/ServerLogger";
import { signInSchema } from "@/zod-schemas/signInSchema";

// Public Objects ------------------------------------------------------------

/**
 * Authentication options for auth.js.
 *
 * TODO: Sessions are not yet supported.
 *
 * @packageDocumentation
 */

export const { auth, handlers, signIn, signOut } = NextAuth({

  pages: {
    signIn: "/signIn",
  },

  providers: [

    Credentials({

      /**
       * Authenticate the profile based on the specified credentials.
       *
       * @param credentials
       */
      async authorize(credentials) {

        logger.trace({
          context: "CredentialsProvider.authorize",
          credentials: credentials,
        });

        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          const profile = await db.profile.findUnique({
            where: {
              email: email,
            },
          });
          if (profile) {
            if (await verifyPassword(password, profile.password)) {
              profile.password = ""; // Redact the hashed password
              return profile;
            }
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          logger.error({
            context: "CredentialsProvider.authorize",
            error: error as Error,
          });
        }
        return null;
      },

      // Fields that will be submitted for authentication
      credentials: {
        email: { label: "Email Address", type: "text" },
        password: { label: "Password", type: "password" },
      },

    }),

  ],

});
