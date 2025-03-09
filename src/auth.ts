// @/auth.ts

/**
 * Configuration for authjs (née next-auth) 5 beta.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Profile } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthError, DefaultSession } from "next-auth";
//import { JWT } from "next-auth/jwt";

// Internal Modules ----------------------------------------------------------

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/Encryption";
import { logger } from "@/lib/ServerLogger";
import { SignInSchemaType } from "@/zod-schemas/SignInSchema";

// Public Objects ------------------------------------------------------------

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's Profile. */
      profile: Profile
    } & DefaultSession["user"]
  }
  interface User {
    profile: Profile
  }
}

/*
declare module "next-auth/jwt" {
  /!** Returned by the `jwt` callback and `getToken`, when using JWT sessions *!/
  interface JWT {
    /!** The user's Profile *!/
    profile: Profile
  }
}
*/

/**
 * Authentication options for auth.js.
 *
 * @packageDocumentation
 */

export const { auth, handlers, signIn, signOut } = NextAuth({

  callbacks: {

    /**
     * Add our local Profile into the JWT token when it is created.
     */
    async jwt({ token, user, account, profile }) {
      logger.trace({
        context: "auth.jwt.input",
        account: account,
        profile: profile,
        token: token,
        user: user,
      });
      if (user) {
        token.profile = user.profile;
      }
      logger.trace({
        context: "auth.jwt.output",
        token: token,
      });
      return token;
    },

    /**
     * Note that the session is being requested.
     */
    async session({ session, token, user }) {
      logger.trace({
        context: "auth.session.input",
        session: session,
        token: token,
        user: user,
      });
      if (token.profile && !session.user.profile) {
        session.user.profile = token.profile as Profile;
      }
      logger.trace({
        context: "auth.session.output",
        session: session,
      });
      return session;
    },

  },

  pages: {
    signIn: "/auth/signIn",
    signOut: "/auth/signOut",
  },

  providers: [

    CredentialsProvider({

      /**
       * Authorize a user based on credentials.
       *
       * @param credentials             The credentials to be verified
       *
       * @returns                       The user profile if the credentials valid
       *
       * @throws AuthError              If the credentials are invalid
       */
      // @ts-expect-error ESLint does not like the type of credentials
      async authorize(credentials: SignInSchemaType) {
        logger.trace({
          context: "auth.authorize.input",
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
            profile.password = "*REDACTED*"; // Redact the hashed password
            logger.trace({
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
//            throw new AuthError("Invalid Credentials");
            return null;
          }
        } else {
          logger.info({
            context: "auth.authorize.failure.email",
            email: credentials.email,
          });
          throw new AuthError("Invalid Credentials");
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
