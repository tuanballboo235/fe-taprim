// src/services/api/api.js
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiEndpoint.js";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
