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