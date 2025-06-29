import type { AuthProvider } from "@refinedev/core";
import {axiosInstance} from "../utils/axios";

export const TOKEN_KEY = "authentication_token";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (email && password) {
      try {
        await axiosInstance.get("/sanctum/csrf-cookie");
        const response: any = await axiosInstance.post("/api/login", { email, password });
        localStorage.setItem(TOKEN_KEY, response.data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        localStorage.setItem("role", response.data.user.role);
        if (response.data.user.role === 'admin') {
          return {
            success: true,
            redirectTo: "/admin/dashboard",
            mesage: response.data.mesage || "Đăng nhập trị viên thành công",
          };
        } else {
          return {
            success: true,
            redirectTo: "/trang-chu",
            mesage: response.data.mesage || "Đăng nhập thành công",
          };
        }
      } catch (error) {
        return { success: false, error: { name: "Tài khoản mật khẩu không tồn tại !", message: "Đăng nhập thất bại !" } };
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
    return {
      success: true,
      redirectTo: "/dang-nhap",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/dang-nhap",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
