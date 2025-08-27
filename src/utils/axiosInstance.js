// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://get-a-car.com/api", // change to your backend
    headers: {
        "Content-Type": "application/json",
    },
});

// Optionally add interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        // Example: attach token if available
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        if (error.response?.status === 401) {
            console.log("Unauthorized! Redirecting to login...");
            // redirect to login page or refresh token
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
