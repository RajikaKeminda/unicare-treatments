import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import getAuthorized from "./get-authorized";
import { getRefreshToken } from "./get-refresh-token";
import { format } from "date-fns";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return getAuthorized(credentials);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user is logged in then user object is available
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        if (user.accessToken) {
          const decodedAccessToken = jwtDecode(user.accessToken);
          token.accessTokenExpires = decodedAccessToken?.exp
            ? decodedAccessToken.exp * 1000 // Convert seconds to milliseconds
            : Date.now() + 15 * 60 * 1000; // Fallback: expire in 15 mins
        }
        if (user.refreshToken) {
          const decodedRefreshToken = jwtDecode(user.refreshToken);
          token.refreshTokenExpires = decodedRefreshToken?.exp
            ? decodedRefreshToken.exp * 1000
            : Date.now() + 60 * 60 * 1000 * 24 * 7;
        }
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token; // Return previous token if not expired
      }

      const newToken = getRefreshToken(token); // Access token has expired, try to refresh it
      return newToken;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id || "",
          isVerified: !!token.isVerified,
          username: token.username,
          role: token.role || "user",
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessExpires: token.accessTokenExpires
            ? format(
                new Date(token.accessTokenExpires),
                "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              )
            : null,
          refreshExpires: token.refreshTokenExpires
            ? format(
                new Date(token.refreshTokenExpires),
                "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
              )
            : null,
          ...(token.error && { error: token.error }),
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
});
