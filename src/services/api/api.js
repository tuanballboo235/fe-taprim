// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7267/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // true nếu dùng cookie auth
});

// Optional: interceptor để tự động thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
