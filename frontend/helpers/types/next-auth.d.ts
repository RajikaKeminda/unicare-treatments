// next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    profile_img?: string | null;
    isVerified?: boolean | null;
    role?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number | null;
    refreshTokenExpires?: number | null;
    accessExpires?: string | null;
    refreshExpires?: string | null;
    error?: string | null;
  }
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      profile_img?: string | null;
      isVerified?: boolean | null;
      role?: string | null;
      accessToken?: string | null;
      refreshToken?: string | null;
      accessTokenExpires?: number | null;
      refreshTokenExpires?: number | null;
      accessExpires?: string | null;
      refreshExpires?: string | null;
      error?: string | null;
    } & DefaultSession["user"];
  }
}

// import { JWT } from "next-auth/jwt"

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    profile_img?: string | null;
    isVerified?: boolean | null;
    role?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpires?: number | null;
    refreshTokenExpires?: number | null;
    accessExpires?: string | null;
    refreshExpires?: string | null;
    error?: string | null;
  }
}
