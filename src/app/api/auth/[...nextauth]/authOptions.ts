import prisma from "@/app/prisma/client";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            const passwordsMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );
            if (passwordsMatch) {
              return user;
            } else {
              return null;
            }
          }
          return null;
        } catch (e) {
          console.log(
            `authOptions.providers.CredentialsProvider.authorize.user query user error`,
            e,
          );
          return null;
        }
      },
    }),
  ],
};