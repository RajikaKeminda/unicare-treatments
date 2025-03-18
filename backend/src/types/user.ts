import { Message, User } from "../models/userModel.ts";
import { Document } from "mongoose";

// export interface IUser {
//   username: string;
//   email: string;
//   password: string;
//   verifyCode: string;
//   verifyCodeExpiry: Date;
//   isVerified: boolean;
//   isAcceptingMessages: boolean;
//   messages: Message;
// }

export interface IVerification {
  email: string;
  username: string;
  verifyCode: string;
}

export interface IUserApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
