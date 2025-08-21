export const paymentStatusMap: Record<string, { color: string; label: string }> = {
    unpaid: { color: "blue", label: "Chưa thanh toán" },
    paid: { color: "green", label: "Đã thanh toán" },
    failed: { color: "red", label: "Thất bại" },
    waiting_for_refund: { color: "purple", label: "Chờ hoàn tiền" },
    refunded: { color: "cyan", label: "Đã hoàn tiền" },
};