export const API_ENDPOINTS = {
  NETFLIX: {
    GET_TEMP_EMAIL: "/netflix/get-email-temporary-watch-netflix",
  },
};

const normalizeBaseUrl = (url) => (url || "").trim().replace(/\/+$/, "");

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const apiProxyTarget = normalizeBaseUrl(import.meta.env.VITE_API_PROXY_TARGET);
const normalizeApiPath = (path) => (path || "").trim().replace(/^\/+|\/+$/g, "");

export const HOSTADDRESS = normalizeBaseUrl(
  import.meta.env.VITE_ASSET_BASE_URL || apiBaseUrl || apiProxyTarget
);
export const API_BASE_URL = apiBaseUrl ? `${apiBaseUrl}/api` : "/api";
export const AUTH_API_PREFIX = normalizeApiPath(
  import.meta.env.VITE_AUTH_API_PREFIX || "Auth"
);

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return `${HOSTADDRESS}/${path.replace(/^\/+/, "")}`;
};
