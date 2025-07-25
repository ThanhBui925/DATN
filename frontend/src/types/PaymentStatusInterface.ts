export const paymentStatusMap: Record<string, { color: string; label: string }> = {
    unpaid: { color: "blue", label: "Chưa thanh toán" },
    paid: { color: "green", label: "Đã thanh toán" },
    failed: { color: "red", label: "Thất bại" },
};