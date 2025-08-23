import React, {useEffect, useState, useRef} from "react";
import {useParams, Link, useSearchParams} from "react-router-dom";
import {axiosInstance} from "../../utils/axios";
import {convertDate, convertToInt} from "../../helpers/common";
import {Input, Modal, notification, Upload, Button} from "antd";
import {statusMap} from "../../types/OrderStatusInterface";
import {paymentMethodMap} from "../../types/PaymentMethodMap";
import {paymentStatusMap} from "../../types/PaymentStatusInterface";

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
    images: [Images];
    status: number;
}

interface Images {
    id: number,
    image_url?: string | null;
}

interface Item {
    id: number;
    product: Product;
    variant: Variant;
    quantity: number;
    price: string;
    is_review?: boolean
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
    status: string;
    leadtime_order: {
        from_estimate_date: string | null;
        to_estimate_date: string | null;
        delivered_date: string | null;
    }
    pickup_time: string | null;
    picked_date: string | null;
    return_reason: string | null;
    return: any;
}

export const OrderDetailContent = () => {
    const {orderId} = useParams<{ orderId: string }>();
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
    const [queryParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<string>('');
    const [refundBank, setRefundBank] = useState<string>('');
    const [refundAccountName, setRefundAccountName] = useState<string>('');
    const [refundAccountNumber, setRefundAccountNumber] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [hidingBtnReceived, setHidingBtnReceived] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
    const [returnReason, setReturnReason] = useState<string>('');
    const [returnRefundBank, setReturnRefundBank] = useState<string>('');
    const [returnRefundAccountName, setReturnRefundAccountName] = useState<string>('');
    const [returnRefundAccountNumber, setReturnRefundAccountNumber] = useState<string>('');
    const [returnErrors, setReturnErrors] = useState<{ [key: string]: string }>({});
    const [hasRequestedReturn, setHasRequestedReturn] = useState(false);
    const [returnFiles, setReturnFiles] = useState<any[]>([]);

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

    const updateOrderStatus = async () => {
        try {
            const res = await axiosInstance.put(`/api/client/orders/${orderId}/delivered`, { order_status: 'delivered'});
            if (res.data.status) {
                notification.success({message: "Đã nhận được hàng !"})
                setHidingBtnReceived(true);
            } else {
                notification.error({message: 'Cập nhật trạng thái thất bại !'});
            }
        } catch (e) {
            console.log(e)
        }
    }

    const getUrlRepayVnpay = async () => {
        try {
            const res = await axiosInstance.get(`/api/client/orders/${orderId}/retry`);
            console.log(res.data);
            if (res.data.status) {
                window.location.href = res.data.data.payment_url;
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const showMsg = queryParams.get('showMsg');

        if (showMsg === '1') {
            notification.success({message: "Thanh toán thành công, đơn hàng đã được xác nhận"});
        } else if (showMsg === '0') {
            notification.error({message: "Thanh toán thất bại, bạn có thể thực hiện thanh toán lại trong 15 phút ."});
        }
    }, [queryParams]);

    const openReviewModal = (productId: number, productName: string) => {
        setSelectedProduct({productId, productName});
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

    const handleCancelOrder = async (reason: string, refundBank?: string, refundAccountName?: string, refundAccountNumber?: string) => {
        try {
            const payload: any = { cancel_reason: reason };
            if (order?.payment_method === 'vnpay' && order?.payment_status === 'paid') {
                payload.refund_bank = refundBank;
                payload.refund_account_name = refundAccountName;
                payload.refund_account_number = refundAccountNumber;
            }
            const res = await axiosInstance.put(`/api/client/orders/${orderId}/cancel`, payload);
            if (res.data.status) {
                notification.success({message: "Đơn hàng đã được hủy!"});
                setOrder(prev => prev ? { ...prev, status: 'canceled', cancel_reason: reason } : null);
            } else {
                notification.error({message: 'Hủy đơn thất bại!'});
            }
        } catch (e) {
            console.error(e);
            notification.error({message: 'Lỗi khi hủy đơn'});
        }
    };

    const handleModalOk = () => {
        const isRefundRequired = order?.payment_method === 'vnpay' && order?.payment_status === 'paid';
        let newErrors: { [key: string]: string } = {};
        if (!cancelReason.trim()) {
            newErrors.cancel_reason = "Vui lòng nhập lý do hủy đơn";
        }
        if (isRefundRequired) {
            if (!refundAccountName.trim()) {
                newErrors.refund_account_name = "Vui lòng nhập tên chủ tài khoản";
            }
            if (!refundBank.trim()) {
                newErrors.refund_bank = "Vui lòng nhập tên ngân hàng";
            }
            if (!refundAccountNumber.trim()) {
                newErrors.refund_account_number = "Vui lòng nhập số tài khoản";
            }
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        handleCancelOrder(cancelReason, refundBank, refundAccountName, refundAccountNumber);
        setIsModalOpen(false);
        setCancelReason('');
        setRefundBank('');
        setRefundAccountName('');
        setRefundAccountNumber('');
        setErrors({});
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setRefundBank('');
        setRefundAccountName('');
        setRefundAccountNumber('');
        setErrors({});
    };

    const showCancelModal = () => {
        setIsModalOpen(true);
    };

    const handleReturnOrder = async (reason: string, refundBank?: string, refundAccountName?: string, refundAccountNumber?: string) => {
        try {
            const formData = new FormData();
            formData.append('return_reason', reason);
            if (order?.payment_method === 'vnpay' && order?.payment_status === 'paid' || order?.payment_method === 'cash') {
                formData.append('refund_bank', refundBank || '');
                formData.append('refund_account_name', refundAccountName || '');
                formData.append('refund_account_number', refundAccountNumber || '');
            }
            returnFiles.forEach((file, index) => {
                formData.append(`return_images[${index}]`, file.originFileObj);
            });
            formData.append("_method", "PUT");
            const res = await axiosInstance.post(`/api/client/orders/${orderId}/return`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status) {
                notification.success({message: "Yêu cầu trả hàng thành công!"});
                setHasRequestedReturn(true);
            } else {
                notification.error({message: 'Yêu cầu trả hàng thất bại!'});
            }
        } catch (e) {
            console.error(e);
            notification.error({message: 'Lỗi khi yêu cầu trả hàng'});
        }
    };

    const handleReturnModalOk = () => {
        const isRefundRequired = order?.payment_method === 'vnpay' && order?.payment_status === 'paid' || order?.payment_method === 'cash';
        let newErrors: { [key: string]: string } = {};
        if (!returnReason.trim()) {
            newErrors.return_reason = "Vui lòng nhập lý do trả hàng";
        }
        if (returnFiles.length === 0) {
            newErrors.return_files = "Vui lòng upload ít nhất một ảnh (tối đa 5 ảnh)";
        }
        if (isRefundRequired) {
            if (!returnRefundAccountName.trim()) {
                newErrors.refund_account_name = "Vui lòng nhập tên chủ tài khoản";
            }
            if (!returnRefundBank.trim()) {
                newErrors.refund_bank = "Vui lòng nhập tên ngân hàng";
            }
            if (!returnRefundAccountNumber.trim()) {
                newErrors.refund_account_number = "Vui lòng nhập số tài khoản";
            }
        }
        setReturnErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        handleReturnOrder(returnReason, returnRefundBank, returnRefundAccountName, returnRefundAccountNumber);
        setIsReturnModalOpen(false);
        setReturnReason('');
        setReturnRefundBank('');
        setReturnRefundAccountName('');
        setReturnRefundAccountNumber('');
        setReturnFiles([]);
        setReturnErrors({});
    };

    const handleReturnModalCancel = () => {
        setIsReturnModalOpen(false);
        setReturnReason('');
        setReturnRefundBank('');
        setReturnRefundAccountName('');
        setReturnRefundAccountNumber('');
        setReturnFiles([]);
        setReturnErrors({});
    };

    const showReturnModal = () => {
        setIsReturnModalOpen(true);
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
            notification.success({message: "Gửi đánh giá thành công !"})
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

    const isRefundRequired =  order.payment_method === 'vnpay' && order.payment_status === 'paid' || order.payment_method === 'cash';

    return (
        <div className="col-12 col-lg-10">
            <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
                <div
                    className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
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
                                backgroundColor: statusMap[order.status]?.cssColor || "#6B7280",
                                padding: "0.5em 1em",
                                fontSize: "0.9em",
                            }}
                        >
              {statusMap[order.status]?.label || "Không xác định"}
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
                                    <p className="mb-0"><strong>Email:</strong> {order.recipient_email}</p>
                                    <p className="mb-0"><strong>Địa chỉ:</strong> {order.shipping_address}</p>

                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-1"><strong>Đơn vị vận
                                        chuyển:</strong> {order.shipping_name || "N/A"}</p>
                                    <p className="mb-0"><strong>Ngày xuất
                                        kho:</strong> {convertDate(order.picked_date) || "N/A"}</p>
                                    <p className="mb-1">
                                        <strong>Ngày giao hàng:</strong>{" "}
                                        {
                                            order.leadtime_order?.delivered_date
                                                ? `Đã giao: ${convertDate(order.leadtime_order.delivered_date)}`
                                                : (order.leadtime_order?.from_estimate_date && order.leadtime_order?.to_estimate_date
                                                        ? <>
                                                            Dự
                                                            kiến: {new Date(order.leadtime_order.from_estimate_date).toLocaleDateString('vi-VN')} - {new Date(order.leadtime_order.to_estimate_date).toLocaleDateString('vi-VN')}
                                                            <br/>
                                                            <i>* Lưu ý: Thời gian giao hàng thực tế có thể sau ngày dự
                                                                kiến</i>
                                                        </>
                                                        : "Chưa có thông tin giao hàng"
                                                )
                                        }
                                    </p>
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
                                    {order.status === "completed" && (
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
                                                    src={item.variant.images[0]?.image_url || item.product.image || "/path/to/fallback-image.jpg"}
                                                    alt={item.product.name}
                                                    className="rounded"
                                                    style={{width: "60px", height: "60px", objectFit: "cover"}}
                                                />
                                                <span className="fw-medium">{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-center">{item.variant?.size?.name}, {item.variant?.color?.name}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end fw-bold text-original-base">{convertToInt(item.price)}₫</td>
                                        {order.status === "completed" && !item.is_review && (
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
                                Tạm Tính: <span
                                className="text-original-base fs-4">{convertToInt(order.subtotal)} ₫</span>
                            </h6>
                            {order.shipping_fee && (
                                <p className="text-muted small mb-1">
                                    Phí vận chuyển: <span
                                    className="text-danger">{convertToInt(order.shipping_fee)} ₫</span>
                                </p>
                            )}
                            {order.voucher_code && order.discount_amount && (
                                <p className="text-muted small mb-1">
                                    Voucher: <span className="text-success">{order.voucher_code}</span> — Giảm:{" "}
                                    <span className="text-success">{convertToInt(order.discount_amount)} ₫</span>
                                </p>
                            )}
                            <h6 className="fw-bold mb-1 text-dark">
                                Tổng Cộng: <span
                                className="text-original-base fs-4">{convertToInt(order.final_amount)} ₫</span>
                            </h6>
                            <p className="text-muted small mb-0">
                                Thanh toán: <span className={`text-${paymentMethodMap[order.payment_method]?.class}`}>{paymentMethodMap[order.payment_method]?.label || "Không xác định"}</span> (
                                <span className={`text-${paymentStatusMap[order.payment_status]?.class}`}>{paymentStatusMap[order.payment_status]?.label || order.payment_status}</span>)
                            </p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap">
                            {
                                order.payment_method === 'vnpay' && order.payment_status !== "paid" && order.status == 'pending' &&  (
                                    <button onClick={getUrlRepayVnpay} className="btn bg-original-base text-white btn-sm px-4 fw-medium">Thanh toán lại</button>
                                )
                            }
                            {["pending", "preparing", "confirmed", "preparing"].includes(order.status) && (
                                <button className="btn btn-outline-danger btn-sm px-4 fw-medium"
                                        onClick={showCancelModal}>Hủy Đơn
                                </button>
                            )}
                            {["delivered"].includes(order.status) && (
                                <button
                                    className={`btn btn-outline-success btn-sm px-4 fw-medium ${hidingBtnReceived && 'd-none'}`}
                                    onClick={updateOrderStatus}
                                >
                                    Đã nhận được hàng
                                </button>
                            )}
                            {order.status === "completed" && !order?.return && !hasRequestedReturn && (
                                <button
                                    className="btn btn-outline-warning btn-sm px-4 fw-medium"
                                    onClick={showReturnModal}
                                >
                                    {isRefundRequired ? "Yêu cầu trả hàng hoàn tiền" : "Yêu cầu trả hàng"}
                                </button>
                            )}
                            <Link to="/don-hang-cua-toi" className="btn btn-outline-secondary btn-sm px-4 fw-medium">
                                Quay lại
                            </Link>
                        </div>
                    </div>
                    {order.cancel_reason && (
                        <div className="mt-5">
                            <div className="section-title-3">
                                <h2>Lý do yêu cầu hủy đơn</h2>
                            </div>
                            <p>{order.cancel_reason}</p>
                        </div>
                    )}
                    {order.return?.reason_for_refusal && (
                        <div className="mt-5">
                            <div className="section-title-3">
                                <h2>Lý do từ chối hủy đơn</h2>
                            </div>
                            <p>{order.return?.reason_for_refusal}</p>
                        </div>
                    )}
                    {order.return?.reason && (
                        <div className="mt-5">
                            <div className="section-title-3">
                                <h2>Lý do yêu cầu hoàn tiền</h2>
                            </div>
                            <p>{order.return?.reason}</p>
                            <i className="text-danger">
                                Hình ảnh dẫn chứng:
                            </i>
                            <div className="d-flex gap-3">
                                {
                                    order.return.evidences && order.return.evidences.length > 0 && (
                                        order.return.evidences.map((evd: any) => (
                                            <img src={evd.file_path} style={{ width: 200, height: 200 }} alt=""/>
                                        ))
                                    )
                                }
                            </div>
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
                style={{display: isReviewModalOpen ? "block" : "none"}}
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
            <Modal
                title="Lý do hủy đơn"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Input.TextArea
                    name="cancel_reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Vui lòng nhập lý do hủy đơn"
                    rows={4}
                />
                {errors.cancel_reason && <div className="text-danger">{errors.cancel_reason}</div>}
                {order?.payment_method === 'vnpay' && order?.payment_status === 'paid' && (
                    <>
                        <Input
                            required
                            style={{ marginTop: 16 }}
                            value={refundAccountName}
                            onChange={(e) => setRefundAccountName(e.target.value)}
                            placeholder="Nhập tên chủ tài khoản"
                        />
                        {errors.refund_account_name && <div className="text-danger">{errors.refund_account_name}</div>}
                        <Input
                            style={{ marginTop: 16 }}
                            value={refundBank}
                            onChange={(e) => setRefundBank(e.target.value)}
                            placeholder="Nhập tên ngân hàng"
                        />
                        {errors.refund_bank && <div className="text-danger">{errors.refund_bank}</div>}
                        <Input
                            style={{ marginTop: 16 }}
                            value={refundAccountNumber}
                            onChange={(e) => setRefundAccountNumber(e.target.value)}
                            placeholder="Nhập số tài khoản"
                        />
                        {errors.refund_account_number && <div className="text-danger">{errors.refund_account_number}</div>}
                    </>
                )}
            </Modal>
            <Modal
                title={isRefundRequired ? "Lý do trả hàng hoàn tiền" : "Lý do trả hàng"}
                open={isReturnModalOpen}
                onOk={handleReturnModalOk}
                onCancel={handleReturnModalCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Input.TextArea
                    name="return_reason"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    placeholder={isRefundRequired ? "Vui lòng nhập lý do trả hàng hoàn tiền" : "Vui lòng nhập lý do trả hàng"}
                    rows={4}
                />
                {returnErrors.return_reason && <div className="text-danger">{returnErrors.return_reason}</div>}
                <Upload
                    multiple
                    maxCount={5}
                    listType="picture"
                    onChange={({ fileList }) => setReturnFiles(fileList)}
                    beforeUpload={() => false}
                >
                    <Button style={{ marginTop: 16 }}>Upload Ảnh</Button>
                </Upload>
                {returnErrors.return_files && <div className="text-danger">{returnErrors.return_files}</div>}
                {isRefundRequired && (
                    <>
                        <Input
                            required
                            style={{ marginTop: 16 }}
                            value={returnRefundAccountName}
                            onChange={(e) => setReturnRefundAccountName(e.target.value)}
                            placeholder="Nhập tên chủ tài khoản"
                        />
                        {returnErrors.refund_account_name && <div className="text-danger">{returnErrors.refund_account_name}</div>}
                        <Input
                            style={{ marginTop: 16 }}
                            value={returnRefundBank}
                            onChange={(e) => setReturnRefundBank(e.target.value)}
                            placeholder="Nhập tên ngân hàng"
                        />
                        {returnErrors.refund_bank && <div className="text-danger">{returnErrors.refund_bank}</div>}
                        <Input
                            style={{ marginTop: 16 }}
                            value={returnRefundAccountNumber}
                            onChange={(e) => setReturnRefundAccountNumber(e.target.value)}
                            placeholder="Nhập số tài khoản"
                        />
                        {returnErrors.refund_account_number && <div className="text-danger">{returnErrors.refund_account_number}</div>}
                    </>
                )}
            </Modal>
        </div>
    );
};