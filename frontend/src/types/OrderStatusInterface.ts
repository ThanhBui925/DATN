export const statusMap: Record<
    string,
    { cssColor: string; bsColor: string; twColor: string; label: string }
> = {
    confirmed: {
        cssColor: "#06b6d4", // cyan-500
        bsColor: "info",
        twColor: "bg-cyan-500 text-white",
        label: "Đã xác nhận",
    },
    preparing: {
        cssColor: "#a855f7",
        bsColor: "secondary",
        twColor: "bg-purple-500 text-white",
        label: "Đang chuẩn bị",
    },
    shipping: {
        cssColor: "#f97316",
        bsColor: "warning",
        twColor: "bg-orange-500 text-white",
        label: "Đang giao",
    },
    delivered: {
        cssColor: "#22c55e",
        bsColor: "success",
        twColor: "bg-green-500 text-white",
        label: "Đã giao",
    },
    completed: {
        cssColor: "#059669",
        bsColor: "success",
        twColor: "bg-emerald-600 text-white",
        label: "Hoàn thành",
    },
    canceled: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Đã hủy",
    },
    pending: {
        cssColor: "#9ca3af",
        bsColor: "secondary",
        twColor: "bg-gray-400 text-white",
        label: "Chờ xử lý",
    },
};
