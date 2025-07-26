import type {AuthProvider} from "@refinedev/core";
import {axiosInstance} from "../utils/axios";
import {notification} from "antd";

export const TOKEN_KEY = "authentication_token";

export const authProvider: AuthProvider = {
    login: async ({email, password}) => {
        if (email && password) {
            try {
                await axiosInstance.get("/sanctum/csrf-cookie");
                const response: any = await axiosInstance.post("/api/login", {email, password});
                localStorage.setItem(TOKEN_KEY, response.data.token);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                if (response.data.user.role === 'admin') {
                    notification.success({message: 'Đăng nhập trị viên thành công'})
                    return {
                        success: true,
                        redirectTo: "/admin/dashboard",
                    };
                } else {
                    notification.success({message: 'Đăng nhập thành công'})
                    return {
                        success: true,
                        redirectTo: "/trang-chu",
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: {name: "Tài khoản mật khẩu không tồn tại !", message: "Đăng nhập thất bại !"}
                };
            }
        }

        return {
            success: false,
            error: {
                name: "Có lỗi từ hệ thống, vui lòng thử lại sau ! ",
                message: "Đăng nhập thất bại !",
            },
        };
    },
    logout: async () => {
        localStorage.removeItem(TOKEN_KEY);
        try {
            const res = await axiosInstance.post('/api/logout')
            if (res.data.status) {
                localStorage.removeItem(TOKEN_KEY);
                notification.success({message: "Đăng xuất thành công"})
                return {
                    success: true,
                    redirectTo: "/dang-nhap",
                };
            } else {
                notification.error({message: "Không thể đăng xuất"})
            }
        } catch (e) {
            notification.error({message: (e as Error).message})
        }
        return {
            success: true,
            redirectTo: "/dang-nhap",
        };
    },
    check: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const isAdminRoute = window.location.pathname.startsWith("/admin");
        let role = 'client';
        if (token) {
            try {
                const res = await axiosInstance.get("/api/profile");
                if (res.data.status) {
                    role = res.data.data.role;
                } else {
                    notification.error({ message: res.data.message || "Lỗi khi tải thông tin profile" });
                }
            } catch (e) {
                notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
            }
            if (isAdminRoute && role !== "admin") {
                return {
                    authenticated: false,
                    redirectTo: "/trang-chu",
                    error: {
                        name: "Quyền truy cập bị từ chối",
                        message: "Chỉ quản trị viên mới được truy cập vào khu vực này!",
                    },
                };
            }
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            redirectTo: "/trang-chu",
        };
    },
    getPermissions: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                const res = await axiosInstance.get("/api/profile");
                if (res.data.status) {
                    return res.data.data.role;
                } else {
                    notification.error({ message: res.data.message || "Lỗi khi tải thông tin profile" });
                }
            } catch (e) {
                notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
            }
        }
        return null;
    },
    getIdentity: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                const res = await axiosInstance.get("/api/profile");
                if (res.data.status) {
                    return res.data.data;
                } else {
                    notification.error({ message: res.data.message || "Lỗi khi tải thông tin profile" });
                }
            } catch (e) {
                notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
            }
        }
        return null;
    },
    onError: async (error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("role");
            notification.error({message: "Phiên đăng nhập hết hạn hoặc không có quyền truy cập!"});
            return {
                error,
                logout: true,
                redirectTo: "/trang-chu",
            };
        }
        console.error(error);
        return {error};
    },
};
