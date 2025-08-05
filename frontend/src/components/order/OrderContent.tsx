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
    tracking_number?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    total: number;
}

export const OrderContent: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<string>('');
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const internalStatuses = ['canceled', 'refunded', 'completed', 'pending', 'preparing', 'confirmed', 'delivered', 'returned'];

    const fetchOrders = useCallback(async (page = 1) => {
        try {
            const res = await axiosInstance.get<{ status: boolean; data: PaginationData; message?: string }>(
                `/api/client/orders?page=${page}`
            );
            if (res.data.status) {
                setOrders(res.data.data.data || []);
                setPagination(res.data.data);
                setCurrentPage(res.data.data.current_page);
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
                    fetchOrders(currentPage);
                } else {
                    notification.error({ message: res.data.message || "Không thể hủy đơn hàng" });
                }
            } catch (e) {
                console.error(e);
                notification.error({ message: "Có lỗi xảy ra khi hủy đơn hàng" });
            }
        },
        [fetchOrders, currentPage]
    );

    const showCancelModal = useCallback((orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    }, []);

    const updateOrderStatus = async (orderId: number) => {
        try {
            const res = await axiosInstance.put(`/api/client/orders/${orderId}/delivered`, { order_status: 'delivered' });
            if (res.data.status) {
                notification.success({ message: "Đã nhận được hàng!" });
                fetchOrders(currentPage);
            } else {
                notification.error({ message: 'Cập nhật trạng thái thất bại!' });
            }
        } catch (e) {
            console.log(e);
        }
    };

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
            if (res.data.status) {
                window.location.href = res.data.data.payment_url;
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchOrders(page);
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [fetchOrders, currentPage]);

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
                                            {order.payment_method === 'vnpay' && order.payment_status !== "paid" && order.status === 'pending' && (
                                                <button
                                                    className="btn bg-original-base text-white btn-sm px-4 fw-medium"
                                                    onClick={() => getUrlRepayVnpay(order.id)}
                                                >
                                                    Thanh toán lại
                                                </button>
                                            )}
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
                                            {["delivered"].includes(order.status) && (
                                                <button
                                                    className="btn btn-outline-success btn-sm px-4 fw-medium"
                                                    onClick={() => updateOrderStatus(order.id)}
                                                >
                                                    Đã nhận được hàng
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Pagination Component */}
                    {pagination && (
                        <nav aria-label="Page navigation" className="mt-4">
                            <ul className="pagination justify-content-center gap-1">
                                <li className={`page-item ${!pagination.prev_page_url ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link rounded-pill px-3 py-2 text-original-base"
                                        style={{ borderColor: '#e85a4f', backgroundColor: pagination.prev_page_url ? 'transparent' : '#f8f9fa' }}
                                        onClick={() => pagination.prev_page_url && handlePageChange(currentPage - 1)}
                                        disabled={!pagination.prev_page_url}
                                    >
                                        &laquo; Previous
                                    </button>
                                </li>
                                {(() => {
                                    const totalPages = pagination.last_page;
                                    const current = pagination.current_page;
                                    const maxButtons = 5;
                                    const half = Math.floor(maxButtons / 2);
                                    let start = Math.max(1, current - half);
                                    const end = Math.min(totalPages, start + maxButtons - 1);

                                    if (end - start + 1 < maxButtons) {
                                        start = Math.max(1, end - maxButtons + 1);
                                    }

                                    const pageButtons = [];
                                    if (start > 1) {
                                        pageButtons.push(
                                            <li key="first" className="page-item">
                                                <button
                                                    className="page-link rounded-circle px-3 py-2 text-original-base"
                                                    style={{ borderColor: '#e85a4f' }}
                                                    onClick={() => handlePageChange(1)}
                                                >
                                                    1
                                                </button>
                                            </li>
                                        );
                                        if (start > 2) {
                                            pageButtons.push(
                                                <li key="ellipsis-start" className="page-item disabled">
                                                    <span className="page-link px-3 py-2 text-original-base">...</span>
                                                </li>
                                            );
                                        }
                                    }

                                    for (let i = start; i <= end; i++) {
                                        pageButtons.push(
                                            <li key={i} className={`page-item ${current === i ? 'active' : ''}`}>
                                                <button
                                                    className={`page-link rounded-circle px-3 py-2 text-original-base ${current === i ? 'active-tab' : 'inactive-tab'}`}
                                                    onClick={() => handlePageChange(i)}
                                                >
                                                    {i}
                                                </button>
                                            </li>
                                        );
                                    }

                                    if (end < totalPages) {
                                        if (end < totalPages - 1) {
                                            pageButtons.push(
                                                <li key="ellipsis-end" className="page-item disabled">
                                                    <span className="page-link px-3 py-2 text-original-base">...</span>
                                                </li>
                                            );
                                        }
                                        pageButtons.push(
                                            <li key="last" className="page-item">
                                                <button
                                                    className="page-link rounded-circle px-3 py-2 text-original-base"
                                                    style={{ borderColor: '#e85a4f' }}
                                                    onClick={() => handlePageChange(totalPages)}
                                                >
                                                    {totalPages}
                                                </button>
                                            </li>
                                        );
                                    }

                                    return pageButtons;
                                })()}
                                <li className={`page-item ${!pagination.next_page_url ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link rounded-pill px-3 py-2 text-original-base"
                                        style={{ borderColor: '#e85a4f', backgroundColor: pagination.next_page_url ? 'transparent' : '#f8f9fa' }}
                                        onClick={() => pagination.next_page_url && handlePageChange(currentPage + 1)}
                                        disabled={!pagination.next_page_url}
                                    >
                                        Next &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
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