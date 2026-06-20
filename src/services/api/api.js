// src/services/api/api.js
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiEndpoint.js";

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

export default api;
