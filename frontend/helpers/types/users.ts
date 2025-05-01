import { TApiResponse } from "./common";

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  role: string;
  reports?: string[];
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: string;
  maritalState?: "single" | "married" | "divorced" | "widowed";
  gender?: "male" | "female" | "other";
}

export type userTypes = "doctor" | "admin" | "supplier" | "user";

export interface UserApiResponse extends TApiResponse {
  user?: IUser;
  users?: IUser[];
}

export interface GetTokenResponse extends TApiResponse {
  accessToken: string;
  refreshToken: string;
}
