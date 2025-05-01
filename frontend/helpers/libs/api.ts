/* eslint-disable @typescript-eslint/no-explicit-any */

import { BACKEND_URL } from "@/utils/common";
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

// --------------------------------------------------------------------------------
// Create base API instance
const api: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store the current token in memory
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;

// Function to get token, only calling getSession() when necessary
const getAuthToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const session = await getSession();
    cachedAccessToken = session?.user?.accessToken || null;
    cachedRefreshToken = session?.user?.refreshToken || null;
    return cachedAccessToken;
  } catch (error) {
    console.error("Error getting session token:", error);
    return null;
  }
};

// --------------------------------------------------------------------------------
// Add a request interceptor to attach the token
api.interceptors.request.use(
  async (request) => {
    const token = await getAuthToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${BACKEND_URL}/users/refreshToken`,
          {
            refreshToken: cachedRefreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        cachedAccessToken = null;
        const { data } = response;
        if (data.refreshToken) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          cachedAccessToken = data.accessToken;
        } else {
          return Promise.reject(error);
        }
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --------------------------------------------------------------------------------
// Export simplified service methods
export const apiService = {
  get: async <T = any>(url: string, config = {}): Promise<T> =>
    (await api.get<T>(url, config)).data,

  post: async <T = any>(url: string, data?: any, config = {}): Promise<T> =>
    (await api.post<T>(url, data, config)).data,

  put: async <T = any>(url: string, data?: any, config = {}): Promise<T> =>
    (await api.put<T>(url, data, config)).data,

  delete: async <T = any>(url: string, config = {}): Promise<T> =>
    (await api.delete<T>(url, config)).data,
};

export default api;
