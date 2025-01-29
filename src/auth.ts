// @/auth.ts

/**
 * Configuration for authjs (née next-auth) 5 beta.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

//import { Profile } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { CredentialsSignin } from "next-auth";

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

  callbacks: {

    /**
     * Add our local Profile o the JWT token when it is created.
     */
/*
    async jwt({ token, user, profile }) {
      logger.info({
        context: "auth.jwt.input",
        profile: profile,
        token: token,
        user: user,
      });
      if (user) {
        token.profile = user;
      }
      logger.info({
        context: "auth.jwt.output",
        token: token,
      });
      return token;
    },
*/

    /**
     * Note that the session is being requested.
     */
/*
  async session({ session, token, user }) {
      logger.info({
        context: "auth.session.input",
        session: session,
        token: token,
        user: user,
      });
      session.user.profile = token.profile as Profile;
      logger.info({
        context: "auth.session.output",
        session: session,
      });
      return session;
    },
*/

  },

  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signOut",
  },

  providers: [

    CredentialsProvider({

      // @ts-expect-error ESLint does not like the type of credentials
      async authorize(credentials: signInSchemaType) {
        logger.trace({
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
          if (verifyPassword(credentials.password, profile.password)) {
            profile.password = ""; // Redact the hashed password
            logger.info({
              context: "auth.authorize.success",
              email: profile.email,
            });
            return {
              email: profile.email,
              image: profile.imageUrl,
              name: profile.name,
              profile: profile,
            };
          } else {
            logger.info({
              context: "auth.authorize.failure.password",
              email: credentials.email,
            });
            return null;
          }
        } else {
          logger.info({
            context: "auth.authorize.failure.email",
            email: credentials.email,
          });
          throw new CredentialsSignin("Invalid Credentials");
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
