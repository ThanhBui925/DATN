import React, { useCallback, useEffect, useState } from 'react';
import { axiosInstance } from "../../utils/axios";
import { convertDate, convertToInt } from "../../helpers/common";
import { Link, useNavigate } from "react-router-dom";
import { notification, Modal, Input } from "antd";
import { statusMap } from "../../types/OrderStatusInterface";
import { paymentMethodMap } from "../../types/PaymentMethodMap";

interface OrderItem {
    id: number;
    product: {
        name: string;
        image: string | null;
    };
    variant: {
        size: { name: string };
        color: { name: string };
    };
    quantity: number;
    price: string;
}

interface Order {
    id: number;
    order_status: string;
    date_order: string;
    payment_method: string;
    final_amount: string;
    order_items: OrderItem[];
    tracking_number?: string; // Số vận đơn (có thể undefined)
}

export const OrderContent: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<string>('');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const internalStatuses = ['canceled', 'refunded', 'completed', 'pending', 'preparing', 'confirmed', 'delivered', 'returned'];

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axiosInstance.get<{ status: boolean; data: { data: Order[] }; message?: string }>(
                '/api/client/orders'
            );
            if (res.data.status) {
                setOrders(res.data.data.data || []);
            } else {
                notification.error({ message: res.data.message || "Không thể tải danh sách đơn hàng" });
            }
        } catch (e) {
            console.error(e);
            notification.error({ message: "Có lỗi xảy ra khi tải đơn hàng" });
        }
    }, []);

    const handleCancelOrder = useCallback(
        async (orderId: number, reason: string) => {
            try {
                const res = await axiosInstance.put<{ status: boolean; message?: string }>(
                    `/api/client/orders/${orderId}/cancel`,
                    { cancel_reason: reason }
                );
                if (res.data.status) {
                    notification.success({ message: "Đã hủy đơn hàng thành công" });
                    fetchOrders();
                } else {
                    notification.error({ message: res.data.message || "Không thể hủy đơn hàng" });
                }
            } catch (e) {
                console.error(e);
                notification.error({ message: "Có lỗi xảy ra khi hủy đơn hàng" });
            }
        },
        [fetchOrders]
    );

    const showCancelModal = useCallback((orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    }, []);

    const handleModalOk = useCallback(() => {
        if (selectedOrderId && cancelReason.trim()) {
            handleCancelOrder(selectedOrderId, cancelReason);
            setIsModalOpen(false);
            setCancelReason('');
            setSelectedOrderId(null);
        } else {
            notification.error({ message: "Vui lòng nhập lý do hủy đơn" });
        }
    }, [selectedOrderId, cancelReason, handleCancelOrder]);

    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
        setCancelReason('');
        setSelectedOrderId(null);
    }, []);

    const getUrlRepayVnpay = async (orderId: number) => {
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
        fetchOrders();
    }, [fetchOrders]);

    const tabs = {
        all: () => true,
        pending: (order: any) => order.status === 'pending',
        confirming: (order: any) => order.status === 'confirming',
        confirmed: (order: any) => order.status === 'confirmed',
        preparing: (order: any) => order.status === 'preparing',
        shipping: (order: any) => !internalStatuses.includes(order.status),
        delivered: (order: any) => order.status === 'delivered',
        completed: (order: any) => order.status === 'completed',
        canceled: (order: any) => order.status === 'canceled',
    };

    const filteredOrders = orders.filter(tabs[activeTab as keyof typeof tabs] || tabs.all);

    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content">
                <div className="container">
                    <nav className="nav nav-tabs">
                        <Link
                            className={`nav-link text-dark ${activeTab === 'all' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('all')}
                        >
                            Tất cả
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'pending' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('pending')}
                        >
                            Chờ xác nhận
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'confirmed' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('confirmed')}
                        >
                            Đã xác nhận
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'shipping' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('shipping')}
                        >
                            Đang giao hàng
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'delivered' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('delivered')}
                        >
                            Đã giao hàng
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'completed' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('completed')}
                        >
                            Hoàn thành
                        </Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'canceled' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('canceled')}
                        >
                            Đã hủy
                        </Link>
                    </nav>
                    <div className="input-group mb-3 mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                        />
                    </div>
                    {filteredOrders.map((order: any) => (
                        <div key={order.id} className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden">
                            <div className="card-header bg-white py-2 px-4 d-flex justify-content-between align-items-center border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-muted fw-medium">Đơn hàng #{order.id}</span>
                                    <span className="text-muted">|</span>
                                    <span className="text-muted">Đặt ngày: {convertDate(order.date_order)}</span>
                                </div>
                                <div className="d-flex gap-2">
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
                                <div className="d-flex flex-column gap-3">
                                    {order.order_items?.map((item: OrderItem, index: number) => (
                                        <div
                                            key={item.id}
                                            className={`d-flex align-items-center gap-3 ${index < order.order_items.length - 1 ? "pb-3 border-bottom" : ""}`}
                                        >
                                            <img
                                                src={item.product?.image || "/path/to/fallback-image.jpg"}
                                                alt={item.product?.name}
                                                className="rounded"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1 text-dark">{item.product?.name}</h6>
                                                <p className="text-muted mb-1 small">
                                                    Phân loại: {item.variant?.size?.name}, {item.variant?.color?.name}
                                                </p>
                                                <p className="text-muted mb-0 small">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="text-end">
                        <span className="fw-bold text-original-base">
                          {convertToInt(item.price)}₫
                        </span>
                                            </div>
                                        </div>
                                    ))}
                                    {activeTab === 'shipping' && (
                                        <div className="mt-3">
                                            <p className="text-muted mb-1">
                                                Số vận đơn (Giao Hàng Nhanh):{' '}
                                                <span className="fw-bold">
                          {order.tracking_number || "Chưa có số vận đơn"}
                        </span>
                                            </p>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3 border-top">
                                        <div>
                      <span className="fw-bold text-muted">
                        Thành tiền:{" "}
                          <span className="text-original-base fs-5">
                          {convertToInt(order.final_amount)}₫
                        </span>
                      </span>
                                        </div>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {
                                                order.payment_method === 'vnpay' && order.payment_status !== "paid" && (
                                                    <button
                                                        className="btn bg-original-base text-white btn-sm px-4 fw-medium"
                                                        onClick={() => getUrlRepayVnpay(order.id)}
                                                    >
                                                        Thanh toán lại
                                                    </button>                                                )
                                            }
                                            <button
                                                className="btn btn-outline-secondary btn-sm px-4 fw-medium"
                                                onClick={() => navigate(`/chi-tiet-don-hang/${order.id}`)}
                                            >
                                                Xem Chi Tiết
                                            </button>
                                            {["pending", "confirmed", "confirming"].includes(order.status) && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm px-4 fw-medium"
                                                    onClick={() => showCancelModal(order.id)}
                                                >
                                                    Hủy Đơn
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
            </Modal>
        </div>
    );
};