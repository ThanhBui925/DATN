import axios from "axios";
import { TOKEN_KEY } from "../providers/authProvider";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
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
        const isAdmin = window.location.pathname.startsWith("/admin");

        if (isAdmin) {
            return Promise.reject(error); // laf admin thì reject lỗi, provider tự xử lý báo lỗi
        } else {
            return Promise.resolve(error.response); // client thì xử lý lỗi
        }
    }
);
