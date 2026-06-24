const ACCESS_TOKEN_KEY = "taprim_access_token";
const USER_KEY = "taprim_auth_user";

const hasWindow = () => typeof window !== "undefined";

const readJson = (key) => {
  if (!hasWindow()) return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredAccessToken = () => {
  if (!hasWindow()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredUser = () => readJson(USER_KEY);

export const setStoredAuth = ({ accessToken, user }) => {
  if (!hasWindow()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
};

export const clearStoredAuth = () => {
  if (!hasWindow()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};

export const decodeJwtPayload = (token) => {
  if (!token || !hasWindow()) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const isJwtExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
};

export const getUserFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  return {
    id:
      payload.nameid ||
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    username:
      payload.unique_name ||
      payload.name ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    role:
      payload.role ||
      payload.roles ||
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  };
};
