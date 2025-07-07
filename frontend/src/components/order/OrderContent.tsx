import React, {useEffect, useState} from 'react';
import {axiosInstance} from "../../utils/axios";
import {convertToInt} from "../../helpers/common";

const statusMap: Record<string, { color: string; label: string }> = {
    confirming: {color: "blue", label: "Đang xác nhận"},
    confirmed: {color: "cyan", label: "Đã xác nhận"},
    preparing: {color: "purple", label: "Đang chuẩn bị"},
    shipping: {color: "orange", label: "Đang giao"},
    delivered: {color: "green", label: "Đã giao"},
    completed: {color: "success", label: "Hoàn thành"},
    canceled: {color: "red", label: "Đã hủy"},
    pending: {color: "default", label: "Chờ xử lý"},
}

export const OrderContent = () => {
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
        pending: (order: any) => order.status === 'pending',
        confirming: (order: any) => order.status === 'confirming',
        confirmed: (order: any) => order.status === 'confirmed',
        preparing: (order: any) => order.status === 'preparing',
        shipping: (order: any) => order.status === 'shipping',
        delivered: (order: any) => order.status === 'delivered',
        completed: (order: any) => order.status === 'completed',
        canceled: (order: any) => order.status === 'canceled',
        'return-refund': (order: any) => order.status === 'canceled',
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const filteredOrders = orders.filter(tabs[activeTab] || tabs.all);
    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content dashboard-content">
                <div className="container mt-4">
                    <nav className="nav nav-tabs">
                        <a
                            className={`nav-link text-dark ${activeTab === 'all' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('all')}
                        >Tất cả</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'pending' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('pending')}
                        >Chờ thanh toán</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'shipping' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('shipping')}
                        >Vận chuyển</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'delivered' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('delivered')}
                        >Chờ giao hàng</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'completed' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('completed')}
                        >Hoàn thành</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'canceled' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('canceled')}
                        >Đã hủy</a>
                        <a
                            className={`nav-link text-dark ${activeTab === 'return-refund' ? 'active text-original-base' : ''}`}
                            href="#"
                            onClick={() => setActiveTab('return-refund')}
                        >Trả hàng/Hoàn tiền</a>
                    </nav>
                    <div className="input-group mb-3 mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                        />
                    </div>
                    {filteredOrders.map((order: any) => (
                        <div key={order.id} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <img src={order.items.products[0].thumbnail} alt={order.items.products[0].name}
                                             style={{width: "50px"}} className="me-3"/>
                                        <span
                                            className="fw-bold">{order.items.products.map((product: any, index: number) => product.name + (index != order.items.products.length ? ',' : ''))}</span>
                                    </div>
                                    <div className="text-end">
                                        <span className="fw-bold">{convertToInt(order.total)}₫</span>
                                        <br/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="d-flex justify-content-between align-items-center">
                              <span
                                  className={`status-badge text-white bg-${statusMap[order.status].color}`}
                                  style={{padding: "0.25em 0.5em", borderRadius: "0.25rem", fontSize: "0.875em"}}
                              >
                                {statusMap[order.status].label}
                              </span>
                                    <div>
                                        <span
                                            className="text-original-base fw-bold">Thành tiền: ₫{order.total.toLocaleString()}</span>
                                        <br/>
                                        <button className="btn bg-original-base text-white">Mua Lại</button>
                                        <button className="btn btn-outline-secondary ms-2">Xem Chi Tiết Hủy Đơn</button>
                                        <button className="btn btn-outline-secondary ms-2">Liên Hệ Người Bán</button>
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