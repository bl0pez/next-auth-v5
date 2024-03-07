import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcryptjs from "bcryptjs";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";
import { getUserById } from "./data/user";

import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import { db } from "./lib/db";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "./data/two-factor-confirmation";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isApiAuthRoute) return true;

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
          callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(
          new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
      }

      return true;
    },
    async signIn({ user, account }) {
      //Permitir OAuth sin email verificado
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      //Prevenir login si el email no está verificado
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          user.id!
        );

        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  providers: [
    Google,
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcryptjs.compare(password, user.password);

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
