// @/auth.ts

/**
 * Authentication options for auth.js.
 *
 * TODO: Sessions are not yet supported.
 *
 * @packageDocumentation
 */

import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";

import { db } from "@/lib/db";
import { verifyPassword} from "@/lib/encryption";
import { logger } from "@/lib/ServerLogger";
import { signInSchema } from "@/zod-schemas/signInSchema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [

    Credentials({

      async authorize(credentials) {

        logger.trace({
          context: "CredentialsProvider.authorize",
          credentials: credentials,
        });

        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          // Do this ourselves because ProfileActions.email() redacts the password
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
