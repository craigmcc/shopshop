// @/app/api/[...next-auth]/authOptions.ts

/**
 * Configuration options for next-auth
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { logger } from "@/lib/ServerLogger";
import { Profile } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/encryption";

// Public Objects ------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  callbacks: {
    // Add our local Profile to the JWT token when the token is created
    async jwt({ token, user, account, profile, isNewUser }) {
      logger.trace({
        context: "NextAuth.jwt.in",
        token: token,
        user: user,
        account: account,
        profile: profile,
        isNewUser: isNewUser,
      });
      if (user) {
        token.profile = user;
      }
      logger.trace({
        context: "NextAuth.jwt.out",
        token: token,
      });
      return token;
    },

    // Note that a redirect was requested
    async redirect({ url, baseUrl }) {
      logger.trace({
        context: "NextAuth.redirect",
        url: url,
        baseUrl: baseUrl,
      });
      return url;
    },

    // Note that the session is being requested
    async session({ session, token, user }) {
      logger.trace({
        context: "NextAuth.session.in",
        session: session,
        token: token,
        user: user,
      });
      session.user.profile = token.profile as Profile;
      logger.trace({
        context: "NextAuth.session.out",
        session: session,
      });
      return session;
    },

    // Note that a sign in has been requested
    async signIn({ user, account, profile, email, credentials }) {
      logger.trace({
        context: "NextAuth.signIn",
        user: user,
        account: account,
        profile: profile,
        email: email,
        credentials: credentials,
      });
      return true;
    },
  },

  pages: {
    signIn: "/signin",
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials, request) {
        logger.trace({
          context: "CredentialsProvider.authorize",
          credentials: credentials,
        });
        const email = credentials?.email ? credentials.email : "";
        const password = credentials?.password ? credentials.password : "";
        try {
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

      credentials: {
        email: { label: "Email Address", type: "text" },
        password: { label: "Password", type: "password" },
      },

      name: "Your Credentials",
    }),

    /*
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
*/
  ],

  session: {
    strategy: "jwt",
  },
};
