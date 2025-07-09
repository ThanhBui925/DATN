import { MoneyCollectOutlined, CreditCardOutlined, WalletOutlined, BankOutlined } from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {notification, Skeleton} from "antd";
import {axiosInstance} from "../utils/axios";
import {convertToInt} from "../helpers/common";
import {TOKEN_KEY} from "../providers/authProvider";

interface Variant {
    id: number;
    size: string;
    color: string;
    quantity: number;
}

interface CartItem {
    id: number;
    product_id: number;
    product_name: string;
    image: string;
    price: string;
    quantity: number;
    total: string;
    size: string;
    color: string;
    variant_id: number;
    available_variants: Variant[];
}

interface CartData {
    items: CartItem[];
    total: string;
}

interface CouponResponse {
    total: string;
    discount_amount: string;
    coupon_code: string;
}

const paymentMethodMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    cash: { label: "Tiền mặt", color: "black", icon: <MoneyCollectOutlined /> },
    card: { label: "Thẻ tín dụng", color: "black", icon: <CreditCardOutlined /> },
    paypal: { label: "PayPal", color: "black", icon: <WalletOutlined /> },
    vnpay: { label: "VNPay", color: "black", icon: <BankOutlined /> },
};

export const Checkout = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<CartData>({items: [], total: "0"});
    const [loading, setLoading] = useState<boolean>(false);
    const [couponCode, setCouponCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);
    const [couponError, setCouponError] = useState<string>("");
    const [profile, setProfile] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        shipping_address: "",
        note: "",
        payment_method: "",
    });
    const [formErrors, setFormErrors] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        shipping_address: "",
        payment_method: "",
    });

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            notification.error({message: "Vui lòng đăng nhập."});
            navigate("/dang-nhap");
        }
    }, [navigate]);

    const getCartData = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/cart");
            if (res.data.status) {
                setCartData({
                    items: res.data.data.items,
                    total: res.data.data.total,
                });
            } else {
                notification.error({message: res.data.message});
            }
        } catch (e: any) {
            notification.error({message: e.message || "Lỗi khi tải giỏ hàng"});
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/profile");
            if (res.data.status) {
                setProfile(res.data.data);
            } else {
                notification.error({ message: res.data.message || "Lỗi khi tải thông tin profile" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCartData();
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData((prev) => ({
                ...prev,
                recipient_name: profile.name || "",
                recipient_phone: profile.customer?.phone || "",
                recipient_email: profile.email || "",
                shipping_address: profile.customer?.address || "",
            }));
        }
    }, [profile]);

    const applyCoupon = async () => {
        if (!couponCode) {
            setCouponError("Vui lòng nhập mã giảm giá");
            return;
        }

        try {
            const res = await axiosInstance.post("/api/client/checkout/apply_coupon", {
                voucher_code: couponCode,
            });

            if (res.data.status) {
                setAppliedCoupon(res.data.data);
                setCouponError("");
                notification.success({ message: res.data.message || "Áp mã giảm giá thành công" });
            } else {
                setCouponError(res.data.message || "Mã giảm giá không hợp lệ");
                notification.error({ message: res.data.message || "Mã giảm giá không hợp lệ" });
            }
        } catch (e: any) {
            const errorMessage =
                e.response?.data?.errors?.voucher_code?.[0] ||
                e.response?.data?.message ||
                e.message ||
                "Lỗi khi áp mã giảm giá";

            setCouponError(errorMessage);
            notification.error({ message: errorMessage });
        }
    };


    const cancelCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
        notification.success({message: "Đã hủy mã giảm giá"});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setFormErrors((prev) => ({...prev, [name]: ""}));
    };

    const handlePaymentMethodChange = (value: string) => {
        setFormData((prev) => ({...prev, payment_method: value}));
        setFormErrors((prev) => ({...prev, payment_method: ""}));
    };

    const validateForm = (data: any) => {
        const errors = {
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            shipping_address: "",
            payment_method: "",
        };
        let isValid = true;

        if (!data.recipient_name.trim()) {
            errors.recipient_name = "Vui lòng nhập họ và tên";
            isValid = false;
        }
        if (!data.recipient_phone.trim()) {
            errors.recipient_phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!/^\d{10}$/.test(data.recipient_phone.trim())) {
            errors.recipient_phone = "Số điện thoại không hợp lệ";
            isValid = false;
        }
        if (!data.recipient_email.trim()) {
            errors.recipient_email = "Vui lòng nhập email";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipient_email.trim())) {
            errors.recipient_email = "Email không hợp lệ";
            isValid = false;
        }
        if (!data.shipping_address.trim()) {
            errors.shipping_address = "Vui lòng nhập địa chỉ nhận hàng";
            isValid = false;
        }
        if (!data.payment_method) {
            errors.payment_method = "Vui lòng chọn phương thức thanh toán";
            isValid = false;
        }
        return {isValid, errors};
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const {isValid, errors} = validateForm(formData);
        if (!isValid) {
            setFormErrors(errors);
            notification.error({message: "Vui lòng kiểm tra thông tin nhập"});
            return;
        }

        try {
            const payload = {
                recipient_name: formData.recipient_name ?? profile.name,
                recipient_phone: formData.recipient_phone ?? profile.customer.phone,
                recipient_email: formData.recipient_email ?? profile.email,
                shipping_address: formData.shipping_address ?? profile.customer.address,
                note: formData.note,
                payment_method: formData.payment_method,
                coupon_code: appliedCoupon ? appliedCoupon.coupon_code : "",
            };
            const res = await axiosInstance.post("/api/client/orders", payload);
            if (res.data.status) {
                notification.success({message: res.data.message || "Đặt hàng thành công"});
                navigate("/don-hang");
            } else {
                notification.error({message: res.data.message || "Lỗi khi đặt hàng"});
            }
        } catch (e: any) {
            notification.error({message: e.message || "Lỗi khi đặt hàng"});
        }
    };

    const displayTotal = appliedCoupon ? appliedCoupon.total : cartData.total;

    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex gap-4">
                                <a className={`d-sm-block d-none`} href="/trang-chu">
                                    <img className={`mt-2`} src="/img/logo/logo.png" alt=""/>
                                </a>
                                <h1 className="cE_Tbx text-original-base">Thanh toán</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-wraper mt-5 mb-4">
                <div className="container-fluid">
                    <div className="checkout-area">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-6 col-xl-5 col-sm-12 offset-xl-1">
                                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                                            <div className="card-body p-4">
                                                <h3 className="fw-bold mb-4 text-dark">Thông tin giao hàng</h3>
                                                <div>
                                                    <div className="row g-3">
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">
                                                                    Họ và tên <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="recipient_name"
                                                                    value={formData.recipient_name}
                                                                    onChange={handleInputChange}
                                                                    placeholder={`Họ và tên`}
                                                                />
                                                                {formErrors.recipient_name && (
                                                                    <div
                                                                        className="text-danger small">{formErrors.recipient_name}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">
                                                                    Số điện thoại <span
                                                                    className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="recipient_phone"
                                                                    value={formData.recipient_phone}
                                                                    onChange={handleInputChange}
                                                                    placeholder={`Số điện thoại`}
                                                                />
                                                                {formErrors.recipient_phone && (
                                                                    <div
                                                                        className="text-danger small">{formErrors.recipient_phone}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">
                                                                    Email <span className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    name="recipient_email"
                                                                    value={formData.recipient_email}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Nhập email"
                                                                />
                                                                {formErrors.recipient_email && (
                                                                    <div
                                                                        className="text-danger small">{formErrors.recipient_email}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">
                                                                    Địa chỉ nhận hàng <span
                                                                    className="text-danger">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="shipping_address"
                                                                    value={formData.shipping_address}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Nhập đầy đủ địa chỉ"
                                                                />
                                                                {formErrors.shipping_address && (
                                                                    <div
                                                                        className="text-danger small">{formErrors.shipping_address}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">Ghi
                                                                    chú</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    name="note"
                                                                    rows={3}
                                                                    value={formData.note}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Ghi chú đơn hàng"
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <div className="form-group">
                                                                <label className="form-label fw-medium">
                                                                    Phương thức thanh toán <span
                                                                    className="text-danger">*</span>
                                                                </label>
                                                                <div className="d-flex flex-column gap-2">
                                                                    {Object.entries(paymentMethodMap).map(([key, { label, color, icon }]) => (
                                                                        <div key={key} className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="radio"
                                                                                name="payment_method"
                                                                                id={`payment_${key}`}
                                                                                value={key}
                                                                                disabled={key !== "cash"}
                                                                                checked={formData.payment_method === key}
                                                                                onChange={() => handlePaymentMethodChange(key)}
                                                                            />
                                                                            <label
                                                                                className="form-check-label d-flex align-items-center gap-2"
                                                                                htmlFor={`payment_${key}`}
                                                                                style={{ color }}
                                                                            >
                                                                                {icon}
                                                                                {label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {formErrors.payment_method && (
                                                                    <div
                                                                        className="text-danger small">{formErrors.payment_method}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-xl-5 col-sm-12">
                                        <div className="card shadow-sm border-0 rounded-3">
                                            <div className="card-body p-4">
                                                <h3 className="fw-bold mb-4 text-dark">Thông tin đơn hàng</h3>
                                                {loading ? (
                                                    <Skeleton active/>
                                                ) : cartData.items.length > 0 ? (
                                                    <>
                                                        <div className="table-responsive">
                                                            <table className="table table-borderless">
                                                                <thead className="bg-light">
                                                                <tr>
                                                                    <th className="fw-medium text-start">Sản phẩm
                                                                    </th>
                                                                    <th className="fw-medium text-end">Tổng tiền
                                                                    </th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {cartData.items.map((item) => (
                                                                    <tr key={item.id} className="align-middle">
                                                                        <td className="text-start">
                                                                            <div
                                                                                className="d-flex align-items-center gap-3">
                                                                                <img
                                                                                    src={item.image || "/path/to/fallback-image.jpg"}
                                                                                    alt={item.product_name}
                                                                                    className="rounded"
                                                                                    style={{
                                                                                        width: "60px",
                                                                                        height: "60px",
                                                                                        objectFit: "cover"
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <Link
                                                                                        to={`/chi-tiet-san-pham/${item.product_id}`}
                                                                                        className="text-dark fw-medium"
                                                                                    >
                                                                                        {item.product_name}
                                                                                    </Link>
                                                                                    <p className="text-muted small mb-0">
                                                                                        Phân
                                                                                        loại: {item.size}, {item.color}
                                                                                    </p>
                                                                                    <p className="text-muted small mb-0">Số
                                                                                        lượng: {item.quantity}</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-end">
                                                                            <span
                                                                                className="fw-bold">{convertToInt(item.total)}₫</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                                <tfoot>
                                                                <tr>
                                                                    <th className="text-start">Tổng tiền sản phẩm
                                                                    </th>
                                                                    <td className="text-end">
                                                                        <span
                                                                            className="fw-bold">{convertToInt(cartData.total)}₫</span>
                                                                    </td>
                                                                </tr>
                                                                {appliedCoupon && (
                                                                    <tr>
                                                                        <th className="text-start">Giảm giá
                                                                            ({appliedCoupon.coupon_code})
                                                                        </th>
                                                                        <td className="text-end">
                                                                        <span className="text-success">
                                                                          -{convertToInt(appliedCoupon.discount_amount)}₫
                                                                        </span>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                                <tr>
                                                                    <th className="text-start">Phí vận chuyển</th>
                                                                    <td className="text-end">Miễn phí</td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="text-start">Tổng cộng</th>
                                                                    <td className="text-end">
                                                                        <strong
                                                                            className="text-original-base fs-5">{convertToInt(displayTotal)}₫</strong>
                                                                    </td>
                                                                </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>

                                                        <div className="mt-4">
                                                            <h6 className="fw-bold mb-3 text-dark">Mã giảm giá</h6>
                                                            <div className="input-group mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Nhập mã giảm giá"
                                                                    value={couponCode}
                                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                                    disabled={!!appliedCoupon}
                                                                />
                                                                {appliedCoupon ? (
                                                                    <button
                                                                        className="btn btn-outline-danger"
                                                                        type="button"
                                                                        onClick={cancelCoupon}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn text-white bg-original-base"
                                                                        type="button"
                                                                        onClick={applyCoupon}
                                                                    >
                                                                        Áp dụng
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {couponError &&
                                                                <div
                                                                    className="text-danger mb-3">{couponError}</div>}
                                                        </div>

                                                        <button
                                                            className="btn bg-original-base text-white w-100 mt-3 py-2 fw-medium"
                                                            onClick={handleSubmit}
                                                        >
                                                            Đặt hàng
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="mt-3 fs-6">Chưa có sản phẩm nào trong giỏ
                                                        hàng!</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}