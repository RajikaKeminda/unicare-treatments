import { IUserApiResponse, IVerification } from "../types/users.ts";
import userModel from "../models/userModel.ts";
import { resend } from "../util/resend.ts";
import { IUser, UserDocument } from "../validation/user-schema.ts";

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

async function getVerifiedCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

async function findUserByUsername(username: string): Promise<UserDocument[]> {
  const user = await userModel.find({
    username: username,
  });
  return user;
}

async function updateVerifiedStatus({ user }: { user: UserDocument }) {
  user.isVerified = true;
  await user.save();
}

async function isUniqueUser(username: string) {
  const user = await userModel.findOne({
    username,
  });
  return user;
}

async function getAllPartially() {
  const user = await userModel.find().select({
    _id: 1,
    username: 1,
    email: 1,
    isVerified: 1,
    role: 1,
    reports: 1,
    firstName: 1,
    lastName: 1,
    dateOfBirth: 1,
    phoneNumber: 1,
    address: 1,
    maritalState: 1,
    gender: 1,
  });
  return user;
}

async function getPartially(id: string) {
  const user = await userModel.findById(id).select({
    username: 1,
    email: 1,
    isVerified: 1,
    role: 1,
    reports: 1,
    firstName: 1,
    lastName: 1,
    dateOfBirth: 1,
    phoneNumber: 1,
    address: 1,
    maritalState: 1,
    gender: 1,
  });
  return user;
}

async function updatePartially(
  id: string,
  data: Partial<IUser>
): Promise<UserDocument | null> {
  const user = await userModel
    .findByIdAndUpdate(id, data, {
      new: true, // Returns the modified document rather than the original
      runValidators: true, // Ensures the update operation runs validation defined in your schema
    })
    .select({
      _id: 1,
      username: 1,
      email: 1,
      isVerified: 1,
      role: 1,
      reports: 1,
      firstName: 1,
      lastName: 1,
      dateOfBirth: 1,
      phoneNumber: 1,
      address: 1,
      maritalState: 1,
      gender: 1,
    });
  return user;
}

async function findUserById(id: string) {
  const user = await userModel.findById(id).select({
    _id: 1,
    username: 1,
    email: 1,
    isVerified: 1,
    role: 1,
    reports: 1,
    firstName: 1,
    lastName: 1,
    dateOfBirth: 1,
    phoneNumber: 1,
    address: 1,
    maritalState: 1,
  });
  return user;
}

export default {
  userWithIdentifier,
  getVerifiedCode,
  createNewUser,
  sendVerificationEmail,
  findUserByUsername,
  updateVerifiedStatus,
  isUniqueUser,
  getAllPartially,
  getPartially,
  updatePartially,
  findUserById,
};
