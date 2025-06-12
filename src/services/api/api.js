// src/services/api/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://103.238.235.227:80/api', // 👉 đổi sang URL thật
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default api
