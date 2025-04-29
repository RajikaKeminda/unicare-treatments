/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "@/libs/api";
import { UserApiResponse } from "@/types/users";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import NextAuth from "next-auth/next";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Please enter both email and password");
          }

          const response = await apiService.post<UserApiResponse>(
            `/user/sign-in`,
            {
              identifier: credentials.identifier,
              password: credentials.password,
            }
          );

          if (!response.success) {
            throw new Error(response.message || "Authentication failed");
          }

          const user = response.user;

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          return {
            id: user._id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
            role: user.role,
          };
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
