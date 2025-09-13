import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7098/",
});

// Request interceptor to inject JWT from cookies
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      Cookies.remove("auth_token");
      // Optionally: redirect to signin or reload to reset state
      // window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
