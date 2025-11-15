import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:7098/",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    config.headers = config.headers || {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const language =
      (typeof window !== "undefined" &&
        window.localStorage?.getItem("language")) ||
      "en";

    config.headers["Accept-Language"] = language === "en" ? "en-US" : "ar-SA";

    return config;
  },
  (error) => Promise.reject(error)
);

const token = Cookies.get("auth_token");
api.interceptors.response.use(

  (response) => response,
  (error) => {
    if (token && error?.response?.status === 401) {
      Cookies.remove("auth_token");
      window.location.href = "/";

    }
    return Promise.reject(error);
  }
);

export default api;
