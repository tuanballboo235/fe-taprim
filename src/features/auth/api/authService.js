import api from "@/shared/api/client";
import { AUTH_API_PREFIX } from "@/shared/utils/apiEndpoint";

const authEndpoint = (path) => `${AUTH_API_PREFIX}/${path}`;

export const login = async ({ username, password }) => {
  const response = await api.post(authEndpoint("login"), {
    username,
    password,
  });

  return response.data?.data ?? response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(authEndpoint("me"));
  return response.data?.data ?? response.data;
};

export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  const response = await api.put(authEndpoint("change-password"), {
    currentPassword,
    newPassword,
    confirmPassword,
  });

  return response.data?.data ?? response.data;
};

export const register = async ({ username, email, password, code }) => {
  const response = await api.post(authEndpoint("register"), {
    username,
    email,
    password,
    code,
  });
  return response.data?.data ?? response.data;
};

export const sendVerificationCode = async ({ email }) => {
  const response = await api.post(authEndpoint("send-code"), {
    email,
  });
  return response.data?.data ?? response.data;
};

export const forgotPassword = async ({ email, newPassword, code }) => {
  const response = await api.post(authEndpoint("forgot-password"), {
    email,
    newPassword,
    code,
  });
  return response.data?.data ?? response.data;
};