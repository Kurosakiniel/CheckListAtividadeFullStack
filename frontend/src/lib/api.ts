import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// 🔥 interceptor → adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});