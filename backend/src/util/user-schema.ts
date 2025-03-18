import { z } from "zod";
import { Document } from "mongoose";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters");

export const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export interface IUser {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  role: string;
}

export type UserDocument = Document<unknown, {}, IUser> &
  IUser &
  Required<{ _id: unknown }> & { __v: number };
