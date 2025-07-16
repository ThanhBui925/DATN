import React, {useEffect, useState} from 'react';
import {axiosInstance} from "../../utils/axios";
import {convertDate, convertToInt} from "../../helpers/common";
import {Link, useNavigate} from "react-router-dom";

const statusMap: Record<string, { color: string; label: string }> = {
    confirming: {color: "#E6F3FF", label: "Đang xác nhận"},
    confirmed: {color: "#3B82F6", label: "Đã xác nhận"},
    preparing: {color: "#E5E7EB", label: "Đang chuẩn bị"},
    shipping: {color: "#FEF3C7", label: "Đang giao hàng"},
    delivered: {color: "#DCFCE7", label: "Đã giao hàng"},
    completed: {color: "#22C55E", label: "Hoàn thành"},
    canceled: {color: "#FECACA", label: "Đã hủy"},
    pending: {color: "#DBEAFE", label: "Chờ xác nhận"},
};

const paymentMethodMap: Record<string, { label: string; color: string }> = {
    cash: {label: "Tiền mặt", color: "gold"},
    card: {label: "Thẻ tín dụng", color: "purple"},
    paypal: {label: "PayPal", color: "blue"},
    vnpay: {label: "VNPay", color: "red"}
};

export const OrderContent = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('all');
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get('/api/client/orders')
            setOrders(res.data.data.data || []);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const tabs = {
        all: () => true,
        pending: (order: any) => order?.order_status === 'pending',
        confirming: (order: any) => order?.order_status === 'confirming',
        confirmed: (order: any) => order?.order_status === 'confirmed',
        preparing: (order: any) => order?.order_status === 'preparing',
        shipping: (order: any) => order?.order_status === 'shipping',
        delivered: (order: any) => order?.order_status === 'delivered',
        completed: (order: any) => order?.order_status === 'completed',
        canceled: (order: any) => order?.order_status === 'canceled',
        'return-refund': (order: any) => order?.order_status === 'canceled',
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredOrders = orders.filter(tabs[activeTab] || tabs.all);
    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content">
                <div className="container">
                    <nav className="nav nav-tabs">
                        <Link
                            className={`nav-link text-dark ${activeTab === 'all' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('all')}
                        >Tất cả</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'pending' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('pending')}
                        >Chờ xác nhận</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'confirmed' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('confirmed')}
                        >Đã xác nhận</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'shipping' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('shipping')}
                        >Đang giao hàng</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'delivered' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('delivered')}
                        >Đã giao hàng</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'completed' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('completed')}
                        >Hoàn thành</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'canceled' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('canceled')}
                        >Đã hủy</Link>
                        <Link
                            className={`nav-link text-dark ${activeTab === 'return-refund' ? 'active text-original-base' : ''}`}
                            to={``}
                            onClick={() => setActiveTab('return-refund')}
                        >Trả hàng/Hoàn tiền</Link>
                    </nav>
                    <div className="input-group mb-3 mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                        />
                    </div>
                    {filteredOrders.map((order: any) => (
                        <div key={order?.id} className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden">
                            {/* Header đơn hàng */}
                            <div
                                className="card-header bg-white py-2 px-4 d-flex justify-content-between align-items-center border-bottom">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="text-muted fw-medium">
                                    Đơn hàng #{order?.id}
                                  </span>
                                    <span className="text-muted">|</span>
                                    <span className="text-muted">
                                    Đặt ngày: {convertDate(order?.date_order)}
                                  </span>
                                </div>
                                <div className={`d-flex gap-2`}>
                                    <span
                                        className="badge text-white fw-semibold"
                                        style={{
                                            backgroundColor: paymentMethodMap[order?.payment_method]?.color,
                                            padding: "0.5em 1em",
                                            fontSize: "0.9em",
                                        }}
                                    >
                                      {paymentMethodMap[order?.payment_method]?.label || "Không xác định"}
                                    </span>
                                    <span
                                        className="badge text-white fw-semibold"
                                        style={{
                                            backgroundColor: statusMap[order?.order_status]?.color,
                                            padding: "0.5em 1em",
                                            fontSize: "0.9em",
                                        }}
                                    >
                                      {statusMap[order?.order_status]?.label || "Không xác định"}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body p-4">
                                <div className="d-flex flex-column gap-3">
                                    {order?.order_items?.map((item: any, index: any) => (
                                        <div
                                            key={item.id}
                                            className={`d-flex align-items-center gap-3 ${index < order.order_items.length - 1 ? "pb-3 border-bottom" : ""}`}
                                        >
                                            <img
                                                src={item?.product?.image}
                                                alt={item?.product?.name}
                                                className="rounded"
                                                style={{width: "80px", height: "80px", objectFit: "cover"}}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1 text-dark">{item?.product?.name}</h6>
                                                <p className="text-muted mb-1 small">
                                                    Phân loại: {item?.variant?.size?.name}, {item?.variant?.color?.name}
                                                </p>
                                                <p className="text-muted mb-0 small">Số lượng: {item?.quantity}</p>
                                            </div>
                                            <div className="text-end">
                                            <span className="fw-bold text-original-base">
                                              {convertToInt(item?.price)}₫
                                            </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div
                                        className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3 border-top">
                                        <div>
                                          <span className="fw-bold text-muted">
                                            Thành tiền:{" "}
                                              <span className="text-original-base fs-5">
                                              {convertToInt(order?.final_amount)}₫
                                            </span>
                                          </span>
                                        </div>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {/*<button className="btn bg-original-base text-white btn-sm px-4 fw-medium">*/}
                                            {/*    Mua Lại*/}
                                            {/*</button>*/}
                                            <button className="btn btn-outline-secondary btn-sm px-4 fw-medium"
                                                    onClick={() => navigate(`/chi-tiet-don-hang/${order?.id}`)}
                                            >
                                                Xem Chi Tiết
                                            </button>
                                            {order?.order_status === "completed" && (
                                                <button className="btn btn-outline-success btn-sm px-4 fw-medium">
                                                    Đánh Giá
                                                </button>
                                            )}
                                            {["pending", "confirmed", "confirming"].includes(order?.order_status) && (
                                                <button className="btn btn-outline-danger btn-sm px-4 fw-medium">
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
        </div>
    )
}