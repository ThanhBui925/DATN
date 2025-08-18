import type { AccessControlProvider, AuthProvider } from "@refinedev/core";
import { axiosInstance } from "../utils/axios";
import { notification } from "antd";

export const TOKEN_KEY = "authentication_token";

let cachedProfile: any = null;
let profilePromise: Promise<any> | null = null;

const getProfile = async () => {
    if (cachedProfile) {
        return cachedProfile;
    }
    if (!profilePromise) {
        profilePromise = axiosInstance.get("/api/profile")
            .then((res) => {
                if (res.data.status) {
                    cachedProfile = res.data.data;
                    profilePromise = null;
                    return cachedProfile;
                } else {
                    throw new Error(res.data.message || "Lỗi khi tải thông tin profile");
                }
            })
            .catch((e) => {
                profilePromise = null;
                throw e;
            });
    }
    return profilePromise;
};

const resetProfileCache = () => {
    cachedProfile = null;
    profilePromise = null;
};

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        if (email && password) {
            try {
                await axiosInstance.get("/sanctum/csrf-cookie");
                const response: any = await axiosInstance.post("/api/login", { email, password });
                localStorage.setItem(TOKEN_KEY, response.data.token);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                resetProfileCache();
                const profile = await getProfile();
                const role = profile.role;
                if (role === 'admin' || role === 'super_admin') {
                    notification.success({ message: 'Đăng nhập quản trị viên thành công' });
                    return {
                        success: true,
                        redirectTo: "/admin/dashboard",
                    };
                } else {
                    notification.success({ message: 'Đăng nhập thành công' });
                    return {
                        success: true,
                        redirectTo: "/trang-chu",
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    error: { name: "Tài khoản mật khẩu không tồn tại !", message: "Đăng nhập thất bại !" }
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
        resetProfileCache();
        try {
            const res = await axiosInstance.post('/api/logout');
            if (res.data.status) {
                notification.success({ message: "Đăng xuất thành công" });
                return {
                    success: true,
                    redirectTo: "/dang-nhap",
                };
            } else {
                notification.error({ message: "Không thể đăng xuất" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
        return {
            success: true,
            redirectTo: "/dang-nhap",
        };
    },
    check: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const isAdminRoute = window.location.pathname.startsWith("/admin");
        if (token) {
            try {
                const profile = await getProfile();
                const role = profile.role;
                if (isAdminRoute && (role !== "admin" && role !== "super_admin")) {
                    return {
                        authenticated: false,
                        redirectTo: "/trang-chu",
                        error: {
                            name: "Quyền truy cập bị từ chối",
                            message: "Chỉ quản trị viên mới được truy cập vào khu vực này!",
                        },
                    };
                }
            } catch (e) {
                notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
            }
            return {
                authenticated: true,
            };
        }
        return {
            authenticated: false,
            redirectTo: "/dang-nhap",
        };
    },
    getPermissions: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                const profile = await getProfile();
                return profile.role;
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
                const profile = await getProfile();
                return profile;
            } catch (e) {
                notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
            }
        }
        return null;
    },
    onError: async (error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            localStorage.removeItem(TOKEN_KEY);
            resetProfileCache();
            notification.error({ message: "Phiên đăng nhập hết hạn hoặc không có quyền truy cập!" });
            return {
                error,
                logout: true,
                redirectTo: "/dang-nhap",
            };
        }
        console.error(error);
        return { error };
    },
};

export const accessControlProvider: AccessControlProvider = {
    can: async ({ resource }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return { can: false };
        try {
            const profile = await getProfile();
            const role = profile.role;
            if (resource === "admins" && role !== "super_admin") {
                return { can: false, reason: "Chỉ Super Admin mới có quyền truy cập Quản lý admin." };
            }
            return { can: true };
        } catch (error) {
            console.error("Error in access control:", error);
            return { can: false, reason: "Lỗi khi kiểm tra quyền truy cập." };
        }
    },
};