export const paymentMethodMap: Record<string, { label: string; color: string, class: string }> = {
    cash: {label: "Tiền mặt", color: "gold", class: 'warning'},
    card: {label: "Thẻ tín dụng", color: "purple", class: "danger"},
    paypal: {label: "PayPal", color: "blue", class: "danger"},
    vnpay: {label: "VNPay", color: "red", class: "danger"}
};