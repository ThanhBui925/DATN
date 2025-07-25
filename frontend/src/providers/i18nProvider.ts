import { I18nProvider } from "@refinedev/core";

export const i18nProvider: I18nProvider = {
    translate: (key: string) => {
        const translations: Record<string, string> = {
            "buttons.save": "Lưu",
            "buttons.logout": "Đăng xuất",
            "buttons.confirm": "Bạn có chắc muốn thực hiện hành động này ?",
            "buttons.delete": "Xóa",
            "buttons.cancel": "Huỷ",
            "buttons.refresh": "Tải lại trang",
            "buttons.edit": "Chỉnh sửa",

            "notifications.success": "Thành công",
            "notifications.error": "Có lỗi xảy ra",
            "notifications.createError": "Tạo thất bại",
            "notifications.createSuccess": "Tạo thành công",
            "notifications.editError": "Cập nhật thất bại",
            "notifications.editSuccess": "Cập nhật thành công",
            "notifications.deleteSuccess": "Xóa thành công",
            "notifications.deleteError": "Xóa thất bại",

            "products.titles.list": "Danh sách sản phẩm",
            "vouchers.titles.list": "Danh sách voucher",
            "sizes.titles.list": "Danh sách kích cỡ",
            "colors.titles.list": "Danh sách màu sắc",
            "orders.titles.list": "Danh sách đơn hàng",
            "banners.titles.list": "Danh sách banner",
            "customers.titles.list": "Danh sách khách hàng",
            "reviews.titles.list": "Danh sách đánh giá",

            "pages.login.title": "Đăng nhập",
            "pages.login.fields.email": "Email",
            "pages.login.fields.password": "Mật khẩu",
            "pages.login.buttons.rememberMe": "Nhớ tôi",
            "pages.login.buttons.forgotPassword": "Quên mật khẩu ?",
            "pages.login.buttons.noAccount": "Chưa có tài khoản ?",
            "pages.login.signup": "Đăng ký tài khoản",
            "pages.login.signin": "Đăng nhập",
        };
        return translations[key] ?? key;
    },
    changeLocale: () => Promise.resolve(),
    getLocale: () => "vi",
};
