import { IUser, userTypes } from "@/types/users";

type levels = "first" | "second" | "third" | "forth";

export const accessLevels: Record<levels, userTypes[]> = {
  first: ["admin"],
  second: ["admin", "doctor"],
  third: ["admin", "doctor", "supplier"],
  forth: ["admin", "doctor", "supplier", "patient"], // logged any user
};

export const isAuthorized = (
  user: IUser | undefined,
  access: levels
): boolean => {
  return !!(
    !!user && // Check if the user exists
    user.isVerified && // Check if the user is verified
    accessLevels[access].includes((user.role || "") as userTypes) // Check if the user's role matches the access level
  );
};
