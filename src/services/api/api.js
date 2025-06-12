// src/services/api/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7267/api', // 👉 đổi sang URL thật
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default api
