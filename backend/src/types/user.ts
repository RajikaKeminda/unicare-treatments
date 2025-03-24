export interface IVerification {
  email: string;
  username: string;
  verifyCode: string;
}

export interface IUserApiResponse {
  success: boolean;
  message: string;
}
