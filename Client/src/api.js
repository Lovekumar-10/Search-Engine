import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Automatically attach token from localStorage/sessionStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // ya sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
