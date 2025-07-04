import type { AuthProvider } from "@refinedev/core";
import {axiosInstance} from "../utils/axios";
import { notification} from "antd";

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
    try {
      const res = await axiosInstance.post('/api/logout')
      if (res.data.success) {
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
