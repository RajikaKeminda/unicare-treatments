import jwt from "jsonwebtoken";

// These should come from environment variables in production
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-token-secret-key";

export const generateTokens = (userId: string, role: string) => {
  // Access token - short lived (e.g., 15 minutes)
  const accessToken = jwt.sign({ _id: userId, role }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  // Refresh token - longer lived (e.g., 7 days)
  const refreshToken = jwt.sign({ _id: userId, role }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
