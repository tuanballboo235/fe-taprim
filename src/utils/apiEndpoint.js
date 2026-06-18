export const API_ENDPOINTS = {
  NETFLIX: {
    GET_TEMP_EMAIL: "/netflix/get-email-temporary-watch-netflix",
  },
};

const normalizeBaseUrl = (url) => (url || "").trim().replace(/\/+$/, "");

export const HOSTADDRESS = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_BASE_URL = `${HOSTADDRESS}/api`;

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return `${HOSTADDRESS}/${path.replace(/^\/+/, "")}`;
};
