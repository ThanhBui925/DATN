import { notification } from "antd";

export const notificationProvider = {
    open: ({ message, description }: {message: any, description: any}) => {
        notification.open({
            message,
            description,
        });
    },
    success: ({ message, description }: {message: any, description: any}) => {
        notification.success({
            message: message || "Thành công",
            description: description || "Thao tác đã thực hiện thành công!",
        });
    },
    error: ({ message, description }: {message: any, description: any}) => {
        notification.error({
            message: message || "Lỗi",
            description: description || "Đã xảy ra lỗi, vui lòng thử lại!",
        });
    },
    warning: ({ message, description }: {message: any, description: any}) => {
        notification.warning({
            message,
            description,
        });
    },
    info: ({ message, description }: {message: any, description: any}) => {
        notification.info({
            message,
            description,
        });
    },
};
