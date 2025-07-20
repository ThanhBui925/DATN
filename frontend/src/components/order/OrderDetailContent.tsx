import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../utils/axios";
import { convertDate, convertToInt } from "../../helpers/common";
import {notification} from "antd";
interface Product {
    id: number;
    name: string;
    image: string | null;
    slug: string | null;
    category_id: number;
    description: string;
    price: string;
    sale_price: string | null;
    sale_end: string | null;
    status: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Variant {
    id: number;
    size: { name: string };
    color: { name: string };
    status: number;
}

interface Item {
    id: number;
    product: Product;
    variant: Variant;
    quantity: number;
    price: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Shipping {
    id: number;
    name: string;
    status: string;
}

interface Order {
    id: number;
    date_order: string;
    final_amount: string;
    total_price: string;
    order_status: string;
    cancel_reason: string | null;
    payment_status: string;
    payment_method: string;
    shipping_address: string;
    recipient_name: string;
    recipient_phone: string;
    shipped_at: string | null;
    delivered_at: string | null;
    discount_amount: string | null;
    user: User;
    customer_id: number | null;
    shipping_id: number;
    shipping_fee: number;
    recipient_email: string | null;
    shipping: Shipping;
    created_at: string;
    updated_at: string;
    voucher_code: string | null;
    items: Item[];
    shipping_name: string;
    subtotal: number;
}

const statusMap: Record<string, { color: string; label: string }> = {
    confirming: { color: "#E6F3FF", label: "Đang xác nhận" },
    confirmed: { color: "#3B82F6", label: "Đã xác nhận" },
    preparing: { color: "#E5E7EB", label: "Đang chuẩn bị" },
    shipping: { color: "#FEF3C7", label: "Đang giao hàng" },
    delivered: { color: "#DCFCE7", label: "Đã giao hàng" },
    completed: { color: "#22C55E", label: "Hoàn thành" },
    canceled: { color: "#FECACA", label: "Đã hủy" },
    pending: { color: "#DBEAFE", label: "Chờ xác nhận" },
};

const paymentMethodMap: Record<string, { label: string; color: string }> = {
    cash: { label: "Tiền mặt", color: "#FFD700" },
    card: { label: "Thẻ tín dụng", color: "#800080" },
    paypal: { label: "PayPal", color: "#0070BA" },
    vnpay: { label: "VNPay", color: "#FF0000" },
};

export const OrderDetailContent = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<{
        productId: number;
        productName: string;
    } | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(`/api/client/orders/${orderId}`);
                setOrder(res.data.data);
                setLoading(false);
            } catch (e: any) {
                setError(e.message || "Lỗi khi tải dữ liệu đơn hàng");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const openReviewModal = (productId: number, productName: string) => {
        setSelectedProduct({ productId, productName });
        setRating(0);
        setComment("");
        setReviewError(null);
        setIsReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedProduct(null);
        setRating(0);
        setComment("");
        setReviewError(null);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        if (rating < 1 || rating > 5) {
            setReviewError("Vui lòng chọn số sao từ 1 đến 5");
            return;
        }
        if (!comment.trim()) {
            setReviewError("Vui lòng nhập nhận xét");
            return;
        }

        setSubmitting(true);
        setReviewError(null);

        try {
            await axiosInstance.post("/api/client/reviews", {
                product_id: selectedProduct.productId,
                user_id: order?.user.id,
                rating,
                comment,
                order_id: order?.id,
            });
            notification.success({ message: "Gửi đánh giá thành công !"})
            if (closeButtonRef.current) {
                closeButtonRef.current.click();
            }
            closeReviewModal();
        } catch (e: any) {
            setReviewError(e.response?.data?.message || "Lỗi khi gửi đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container my-5 text-center">Đang tải...</div>;
    if (error) return <div className="container my-5 text-center text-danger">Lỗi: {error}</div>;
    if (!order) return <div className="container my-5 text-center">Không tìm thấy đơn hàng</div>;

    return (
        <div className="col-12 col-lg-10">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
                    <div className="d-flex flex-column">
                        <h5 className="fw-bold mb-1 text-dark">Chi tiết đơn hàng #{order.id}</h5>
                        <span className="text-muted small">Đặt ngày: {convertDate(order.date_order)}</span>
                        <span className="text-muted small">Cập nhật lần cuối: {convertDate(order.updated_at)}</span>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
            <span
                className="badge text-white fw-semibold"
                style={{
                    backgroundColor: paymentMethodMap[order.payment_method]?.color || "#6B7280",
                    padding: "0.5em 1em",
                    fontSize: "0.9em",
                }}
            >
              {paymentMethodMap[order.payment_method]?.label || "Không xác định"}
            </span>
                        <span
                            className="badge text-white fw-semibold"
                            style={{
                                backgroundColor: statusMap[order.order_status]?.color || "#6B7280",
                                padding: "0.5em 1em",
                                fontSize: "0.9em",
                            }}
                        >
              {statusMap[order.order_status]?.label || "Không xác định"}
            </span>
                    </div>
                </div>

                <div className="card-body p-4">
                    <div className="mb-4">
                        <h6 className="fw-bold mb-3 text-dark">Thông tin khách hàng</h6>
                        <div className="bg-light p-3 rounded">
                            <p className="mb-1"><strong>Tên:</strong> {order.user.name}</p>
                            <p className="mb-0"><strong>Email:</strong> {order.user.email}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6 className="fw-bold mb-3 text-dark">Thông tin giao hàng</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-1"><strong>Người nhận:</strong> {order.recipient_name}</p>
                                    <p className="mb-1"><strong>Số điện thoại:</strong> {order.recipient_phone}</p>
                                    <p className="mb-0"><strong>Địa chỉ:</strong> {order.shipping_address}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-1"><strong>Đơn vị vận chuyển:</strong> {order.shipping_name || "N/A"}</p>
                                    <p className="mb-1"><strong>Ngày giao hàng:</strong> {convertDate(order.delivered_at) || "N/A"}</p>
                                    <p className="mb-0"><strong>Ngày xuất kho:</strong> {convertDate(order.shipped_at) || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6 className="fw-bold mb-3 text-dark">Sản phẩm trong đơn hàng</h6>
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <thead className="bg-light">
                                <tr>
                                    <th scope="col" className="fw-medium">Sản phẩm</th>
                                    <th scope="col" className="fw-medium text-center">Phân loại</th>
                                    <th scope="col" className="fw-medium text-center">Số lượng</th>
                                    <th scope="col" className="fw-medium text-end">Giá</th>
                                    {order.order_status === "completed" && (
                                        <th scope="col" className="fw-medium text-end">Đánh giá</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="align-middle">
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={item.product.image || "/path/to/fallback-image.jpg"}
                                                    alt={item.product.name}
                                                    className="rounded"
                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                />
                                                <span className="fw-medium">{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-center">{item.variant?.size?.name}, {item.variant?.color?.name}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end fw-bold text-original-base">{convertToInt(item.price)}₫</td>
                                        {order.order_status === "completed" && !item.is_review && (
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-outline-success btn-sm px-4 fw-medium"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#reviewModal"
                                                    onClick={() => openReviewModal(item.product.id, item.product.name)}
                                                >
                                                    Đánh Giá
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 border-top pt-3">
                        <div>
                            <h6 className="fw-bold mb-1 text-dark">
                                Tạm Tính: <span className="text-original-base fs-4">{convertToInt(order.subtotal)} ₫</span>
                            </h6>
                            {order.shipping_fee && (
                                <p className="text-muted small mb-1">
                                    Phí vận chuyển: <span className="text-danger">{convertToInt(order.shipping_fee)} ₫</span>
                                </p>
                            )}
                            {order.voucher_code && order.discount_amount && (
                                <p className="text-muted small mb-1">
                                    Voucher: <span className="text-success">{order.voucher_code}</span> — Giảm:{" "}
                                    <span className="text-success">{convertToInt(order.discount_amount)} ₫</span>
                                </p>
                            )}
                            <h6 className="fw-bold mb-1 text-dark">
                                Tổng Cộng: <span className="text-original-base fs-4">{convertToInt(order.final_amount)} ₫</span>
                            </h6>
                            <p className="text-muted small mb-0">
                                Thanh toán: {paymentMethodMap[order.payment_method]?.label || "Không xác định"} (
                                {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"})
                            </p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            <button className="btn bg-original-base text-white btn-sm px-4 fw-medium">Mua Lại</button>
                            {["pending", "confirming", "confirmed"].includes(order.order_status) && (
                                <button className="btn btn-outline-danger btn-sm px-4 fw-medium">Hủy Đơn</button>
                            )}
                            <Link to="/don-hang-cua-toi" className="btn btn-outline-secondary btn-sm px-4 fw-medium">
                                Quay lại
                            </Link>
                        </div>
                    </div>
                    {order.cancel_reason && (
                        <div className="mt-5">
                            <div className="section-title-3">
                                <h2>Lý do hủy đơn</h2>
                            </div>
                            <p>{order.cancel_reason}</p>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`modal fade ${isReviewModalOpen ? "show" : ""}`}
                id="reviewModal"
                tabIndex={-1}
                aria-labelledby="reviewModalLabel"
                aria-hidden={!isReviewModalOpen}
                style={{ display: isReviewModalOpen ? "block" : "none" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold" id="reviewModalLabel">
                                Đánh giá sản phẩm: {selectedProduct?.productName}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ref={closeButtonRef}
                                onClick={closeReviewModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Điểm đánh giá</label>
                                    <div className="d-flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={`btn p-1 ${rating >= star ? "text-warning" : "text-muted"}`}
                                                onClick={() => setRating(star)}
                                            >
                                                <i className="fa fa-star"></i>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Nhận xét</label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Nhập nhận xét của bạn..."
                                    ></textarea>
                                </div>
                                {reviewError && <div className="text-danger mb-3">{reviewError}</div>}
                                <div className="d-flex gap-2 justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn bg-original-base text-white btn-sm px-4 fw-medium"
                                        disabled={submitting}
                                    >
                                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm px-4 fw-medium"
                                        data-bs-dismiss="modal"
                                        onClick={closeReviewModal}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};