import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { BACKEND_URL } from "./common";

export async function getRefreshToken(token: JWT): Promise<JWT> {
  // Access token has expired, try to refresh it
  try {
    const response = await axios.post(
      `${BACKEND_URL}/users/refreshToken`,
      {
        refreshToken: token.refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;

    if (!data.success) {
      throw new Error("RefreshAccessTokenError");
    }

    const decodedAccessToken = jwtDecode(data.accessToken);
    const newAccessTokenExpiration = decodedAccessToken?.exp
      ? decodedAccessToken.exp * 1000 // Convert seconds to milliseconds
      : Date.now() + 15 * 60 * 1000; // Fallback: expire in 15 mins

    const decodedRefreshToken = jwtDecode(data.refreshToken);
    const newRefreshTokenExpiration = decodedRefreshToken?.exp
      ? decodedRefreshToken.exp * 1000 // Convert seconds to milliseconds
      : Date.now() + 60 * 60 * 1000 * 24 * 7;

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || token.refreshToken, // Use new refresh token if provided
      accessTokenExpires: newAccessTokenExpiration,
      refreshTokenExpires: newRefreshTokenExpiration,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    // The error property will be used to trigger a sign out in the client
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
