import { IUserApiResponse, IVerification } from "../types/user.ts";
import userModel from "../models/userModel.ts";
import { resend } from "../util/resend.ts";
import { IUser, UserDocument } from "../util/user-schema.ts";

async function createNewUser(data: Partial<IUser>) {
  const user = new userModel({
    username: data.username,
    email: data.email,
    password: data.password,
    verifyCode: data.verifyCode,
    verifyCodeExpiry: data.verifyCodeExpiry,
    isVerified: false,
  });
  const newUser = await user.save();
  return newUser;
}

async function findUserByUsername(username: string): Promise<UserDocument[]> {
  const user = await userModel.find({
    username: username,
  });
  return user;
}

async function getAll() {
  const users = await userModel.find();
  return users;
}

async function getVerifiedCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function isUniqueUser(username: string) {
  const user = await userModel.findOne({
    username,
  });
  return user;
}

async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: IVerification): Promise<IUserApiResponse> {
  try {
    await resend.emails.send({
      from: "contact@duminda.net",
      to: email,
      subject: "Your Verification Code",
      html: `
      <h1>Hi ${username},</h1>
      <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
      <p>Here&apos;s your verification code: <strong>${verifyCode}</strong></p>
      <p>If you did not request this code, please ignore this email.</p>
      `,
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    return { success: false, message: "Failed to send verification email." };
  }
}

async function updateUserWithNewVerification({
  user,
  verifyCode,
}: {
  user: UserDocument;
  verifyCode: string;
}) {
  user.verifyCode = verifyCode;
  user.verifyCodeExpiry = new Date(Date.now() + 3600000);
  await user.save();
}

async function updateVerifiedStatus({ user }: { user: UserDocument }) {
  user.isVerified = true;
  await user.save();
}

async function userWithIdentifier({
  email,
  username,
}: {
  email: string;
  username: string;
}) {
  const user = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });
  return user;
}

export default {
  createNewUser,
  findUserByUsername,
  getAll,
  getVerifiedCode,
  isUniqueUser,
  sendVerificationEmail,
  updateUserWithNewVerification,
  userWithIdentifier,
  updateVerifiedStatus,
};
