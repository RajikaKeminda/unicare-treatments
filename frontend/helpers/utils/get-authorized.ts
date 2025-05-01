import { IUser } from "@/types/users";
import axios from "axios";
import { BACKEND_URL } from "./common";

export default async function getAuthorized(
  credentials: Partial<Record<"identifier" | "password", unknown>>
): Promise<IUser> {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/profile/sign-in`,
      {
        identifier: credentials.identifier,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;

    if (data.success === false) {
      throw new Error(data.message);
    }

    const user = data.user;

    if (!user) {
      throw new Error("No user found with this email");
    }
    if (!user.isVerified) {
      throw new Error("Please verify your account before logging in");
    }
    return user;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error(String(err));
    }
  }
}
