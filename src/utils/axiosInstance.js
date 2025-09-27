import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7098/",
});

// Request interceptor to inject JWT from cookies and current language from LanguageContext (via localStorage)
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    config.headers = config.headers || {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Read the language set by LanguageContext from localStorage
    const language = (typeof window !== "undefined" && window.localStorage?.getItem("language")) || "en";
    config.headers["Accept-Language"] = language;

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
