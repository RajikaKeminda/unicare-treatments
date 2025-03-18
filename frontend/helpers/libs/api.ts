/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Create base API instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8081/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type ApiResponse<T = any> = Promise<T>;

// Export simplified service methods
export const apiService = {
  get: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): ApiResponse<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): ApiResponse<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {}
  ): ApiResponse<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): ApiResponse<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

export default api;
