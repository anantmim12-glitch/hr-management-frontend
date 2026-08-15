import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("role");
            window.location.href = "/login";
        }

        // ✅ Handle 403 Forbidden (Employee trying to edit/delete)
        if (error.response?.status === 403) {
            toast.error("You do not have permission to perform this action.");
        }

        return Promise.reject(error);
    }
);