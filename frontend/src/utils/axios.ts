import axios from "axios";
import {TOKEN_KEY} from "../authProvider";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000",
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
