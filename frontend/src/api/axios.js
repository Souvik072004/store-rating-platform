import axios from "axios";

const DEFAULT_API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://store-rating-platform-2htm.onrender.com/api"
    : "http://localhost:5000/api";

const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.includes("/auth")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;