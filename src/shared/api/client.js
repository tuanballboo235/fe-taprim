// src/services/api/api.js
import axios from "axios";
import { API_BASE_URL } from "@/shared/utils/apiEndpoint";
import {
  clearStoredAuth,
  getStoredAccessToken,
} from "@/features/auth/utils/authStorage";

const isNgrokUrl = /\.ngrok(-free)?\./i.test(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: isNgrokUrl
    ? {
        "ngrok-skip-browser-warning": "true",
      }
    : undefined,
});

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error?.response?.status === 401;
    const isLoginRequest = error?.config?.url?.toLowerCase().includes("login");

    if (isUnauthorized && !isLoginRequest) {
      clearStoredAuth();

      if (typeof window !== "undefined") {
        const currentPath = `${window.location.pathname}${window.location.search}`;
        const isAlreadyLogin = window.location.pathname === "/login";

        if (!isAlreadyLogin) {
          window.location.assign(
            `/login?redirect=${encodeURIComponent(currentPath)}`
          );
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
