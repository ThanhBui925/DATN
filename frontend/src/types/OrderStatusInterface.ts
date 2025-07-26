export const statusMap: Record<
    string,
    { cssColor: string; bsColor: string; twColor: string; label: string }
> = {
    //internal
    confirmed: {
        cssColor: "#06b6d4",
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

    // GHN
    ready_to_pick: {
        cssColor: "#9ca3af",
        bsColor: "secondary",
        twColor: "bg-gray-400 text-white",
        label: "Sẵn sàng để GHN lấy hàng",
    },
    picking: {
        cssColor: "#a855f7",
        bsColor: "secondary",
        twColor: "bg-purple-500 text-white",
        label: "Đang lấy hàng",
    },
    picked: {
        cssColor: "#06b6d4",
        bsColor: "info",
        twColor: "bg-cyan-500 text-white",
        label: "Đã lấy hàng thành công",
    },
    cancel: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Hủy đơn",
    },
    money_collect_picking: {
        cssColor: "#059669",
        bsColor: "success",
        twColor: "bg-emerald-600 text-white",
        label: "GHN thu tiền khi lấy hàng",
    },
    storing: {
        cssColor: "#f97316",
        bsColor: "warning",
        twColor: "bg-orange-500 text-white",
        label: "Hàng đang ở kho GHN",
    },
    transporting: {
        cssColor: "#22c55e",
        bsColor: "success",
        twColor: "bg-green-500 text-white",
        label: "Đang vận chuyển",
    },
    sorting: {
        cssColor: "#a855f7",
        bsColor: "secondary",
        twColor: "bg-purple-500 text-white",
        label: "Đang phân loại",
    },
    delivering: {
        cssColor: "#f97316",
        bsColor: "warning",
        twColor: "bg-orange-500 text-white",
        label: "Đang giao",
    },
    money_collect_delivering: {
        cssColor: "#059669",
        bsColor: "success",
        twColor: "bg-emerald-600 text-white",
        label: "GHN thu tiền khi giao",
    },
    delivered: {
        cssColor: "#22c55e",
        bsColor: "success",
        twColor: "bg-green-500 text-white",
        label: "Đã giao hàng",
    },
    delivery_fail: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Giao hàng thất bại",
    },
    waiting_to_return: {
        cssColor: "#9ca3af",
        bsColor: "secondary",
        twColor: "bg-gray-400 text-white",
        label: "Chờ trả hàng",
    },
    return: {
        cssColor: "#06b6d4",
        bsColor: "info",
        twColor: "bg-cyan-500 text-white",
        label: "Bắt đầu trả hàng",
    },
    return_transporting: {
        cssColor: "#22c55e",
        bsColor: "success",
        twColor: "bg-green-500 text-white",
        label: "Hàng trả đang vận chuyển",
    },
    return_sorting: {
        cssColor: "#a855f7",
        bsColor: "secondary",
        twColor: "bg-purple-500 text-white",
        label: "Phân loại hàng trả",
    },
    returning: {
        cssColor: "#f97316",
        bsColor: "warning",
        twColor: "bg-orange-500 text-white",
        label: "Quá trình trả hàng đang diễn ra",
    },
    return_fail: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Trả hàng thất bại",
    },
    returned: {
        cssColor: "#059669",
        bsColor: "success",
        twColor: "bg-emerald-600 text-white",
        label: "Trả hàng thành công",
    },
    exception: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Gặp sự cố (bắt buộc kiểm tra thêm, liên hệ bộ phận GHN)",
    },
    damage: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Hàng hóa bị hư hỏng trong quá trình vận chuyển",
    },
    lost: {
        cssColor: "#ef4444",
        bsColor: "danger",
        twColor: "bg-red-500 text-white",
        label: "Hàng hóa bị thất lạc/mất trong quá trình vận chuyển",
    },

    // internal
    pending: {
        cssColor: "#9ca3af",
        bsColor: "secondary",
        twColor: "bg-gray-400 text-white",
        label: "Chờ xử lý",
    },
    completed: {
        cssColor: "#059669",
        bsColor: "success",
        twColor: "bg-emerald-600 text-white",
        label: "Hoàn thành",
    },
    refunded: {
        cssColor: "#06b6d4",
        bsColor: "info",
        twColor: "bg-cyan-500 text-white",
        label: "Đã hoàn tiền",
    },
};

export const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "canceled"],
    confirmed: ["preparing", "canceled"],
    preparing: ["ready_to_pick", "canceled"],
    completed: [],
    canceled: [],
    returned: ['refunded'],
    return_fail: ['returning']
};