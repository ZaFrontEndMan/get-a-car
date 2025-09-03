import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const axiosInstance = axios.create({
    baseURL: "https://test.get2cars.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("auth_token");
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

        if (error.response?.data?.customMessage) {
            toast.error(error.response.data.customMessage);
        } else if (error.message) {

            toast.error(error.message);
        }

        if (error.response?.status === 401) {
            Cookies.remove("auth_token");
            // toast.error("Your session has expired. Please log in again.");
            //             window.location.href = "/signin";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
