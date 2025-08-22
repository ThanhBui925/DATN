export const paymentStatusMap: Record<string, { class: string, color: string; label: string }> = {
    unpaid: { class: "primary", color: "blue", label: "Chưa thanh toán" },
    paid: { class: "success", color: "green", label: "Đã thanh toán" },
    failed: { class: "danger", color: "red", label: "Thất bại" },
    waiting_for_refund: { class: "warning", color: "yellow", label: "Chờ hoàn tiền" },
    refunded: { class: "success", color: "green", label: "Đã hoàn tiền" },
};