import axios from "axios";

export const axiosGHNInstance = axios.create({
    baseURL: import.meta.env.VITE_GHN_API_URL || "https://online-gateway.ghn.vn/shiip/public-api/master-data",
    withCredentials: false,
});

axiosGHNInstance.interceptors.request.use(
    (config) => {
        const token = import.meta.env.VITE_GHN_TOKEN || "7675d401-5daa-11f0-99f8-027692bb547c";
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
