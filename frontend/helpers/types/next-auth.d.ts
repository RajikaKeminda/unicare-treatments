// next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    profile_img?: string;
    isVerified?: boolean;
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      username?: string;
      email?: string;
      profile_img?: string;
      isVerified?: boolean;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    profile_img?: string;
    isVerified?: boolean;
    role?: string;
  }
}
