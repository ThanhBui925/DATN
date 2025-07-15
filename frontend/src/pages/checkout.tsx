import {MoneyCollectOutlined, CreditCardOutlined, WalletOutlined, BankOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {notification, Skeleton, Select} from "antd";
import {axiosInstance} from "../utils/axios";
import {convertToInt} from "../helpers/common";
import {TOKEN_KEY} from "../providers/authProvider";
import axios from "axios";
import {axiosGHNInstance} from "../utils/axios_ghn";

const {Option} = Select;

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
    final_price: string;
    discount_amount: string;
    voucher_code: string;
    original_price: string;
}

interface Province {
    ProvinceID: string;
    ProvinceName: string;
    Code: string;
}

interface District {
    DistrictID: string;
    DistrictName: string;
    Code: string;
    ProvinceID: number;
}

interface Ward {
    WardCode: string;
    WardName: string;
    DistrictID: number;
}

interface Address {
    id: number;
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    address: string;
    is_default: boolean;
}

const paymentMethodMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    cash: {label: "Tiền mặt", color: "black", icon: <MoneyCollectOutlined/>},
    card: {label: "Thẻ tín dụng", color: "black", icon: <CreditCardOutlined/>},
    paypal: {label: "PayPal", color: "black", icon: <WalletOutlined/>},
    vnpay: {label: "VNPay", color: "black", icon: <BankOutlined/>},
};

export const Checkout = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<CartData>({items: [], total: "0"});
    const [loading, setLoading] = useState<boolean>(false);
    const [voucherCode, setVoucherCode] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);
    const [couponError, setCouponError] = useState<string>("");
    const [profile, setProfile] = useState<any | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [useNewAddress, setUseNewAddress] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        province: "",
        district: "",
        ward: "",
        detailed_address: "",
        note: "",
        payment_method: "",
    });
    const [formErrors, setFormErrors] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        province: "",
        district: "",
        ward: "",
        detailed_address: "",
        payment_method: "",
        address_selection: "",
    });
    const [shippingFee, setShippingFee] = useState<number>(0);

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
                notification.error({message: res.data.message || "Lỗi khi tải thông tin profile"});
            }
        } catch (e) {
            notification.error({message: (e as Error).message || "Lỗi khi tải thông tin profile"});
        } finally {
            setLoading(false);
        }
    };

    const fetchShippingFee = async (
        addressId: number | null,
        provinceId?: string,
        districtId?: string,
        wardCode?: string
    ) => {
        try {
            const payload = addressId
                ? { address_id: addressId }
                : {
                    province_id: provinceId,
                    district_id: districtId,
                    ward_code: wardCode,
                };

            const res = await axiosInstance.post("/api/client/shipping-fee", payload);

            if (res.status === 200 && typeof res.data.total_shipping_fee === "number") {
                setShippingFee(res.data.total_shipping_fee);
            } else {
                setShippingFee(0);
                notification.error({
                    message: res.data.message || "Lỗi khi tính phí vận chuyển",
                });
            }
        } catch (e: any) {
            setShippingFee(0);
            notification.error({
                message: e?.response?.data?.message || e.message || "Lỗi khi tính phí vận chuyển",
            });
        }
    };


    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/addresses");
            if (res.data.status) {
                setAddresses(res.data.data);
                const addressData: Address[] = res.data.data;
                addressData.map((item: Address) => {
                    if (item.is_default) {
                        setSelectedAddressId(item.id);
                    }
                })
            } else {
                notification.error({message: res.data.message || "Lỗi khi tải danh sách địa chỉ"});
            }
        } catch (e) {
            notification.error({message: (e as Error).message || "Lỗi khi tải danh sách địa chỉ"});
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async () => {
        try {
            const res = await axiosGHNInstance("/province");
            if (res.data.message == 'Success') {
                setProvinces(res.data.data);
            }
        } catch (e) {
            notification.error({message: "Lỗi khi tải danh sách tỉnh/thành phố"});
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        try {
            const res = await axiosGHNInstance(`/district?province_id=${provinceId}`);
            if (res.data.message == 'Success') {
                setDistricts(res.data.data);
                setWards([]);
            }
        } catch (e) {
            notification.error({message: "Lỗi khi tải danh sách quận/huyện"});
        }
    };

    const fetchWards = async (districtId: string) => {
        try {
            const res = await axiosGHNInstance(`/ward?district_id=${districtId}`);
            if (res.data.message == 'Success') {
                setWards(res.data.data);
            }
        } catch (e) {
            notification.error({message: "Lỗi khi tải danh sách phường/xã"});
        }
    };

    useEffect(() => {
        getCartData();
        fetchProfile();
        fetchProvinces();
        fetchAddresses();
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData((prev) => ({
                ...prev,
                recipient_name: profile.name || "",
                recipient_phone: profile.customer?.phone || "",
                recipient_email: profile.email || "",
                detailed_address: profile.customer?.address || "",
            }));
        }
    }, [profile]);

    useEffect(() => {
        if (selectedAddressId && !useNewAddress) {
            fetchShippingFee(selectedAddressId);
        }
    }, [selectedAddressId]);

    useEffect(() => {
        if (useNewAddress && formData.province && formData.district && formData.ward) {
            fetchShippingFee(null, formData.province, formData.district, formData.ward);
        }
    }, [formData.province, formData.district, formData.ward, useNewAddress]);

    const applyCoupon = async () => {
        if (!voucherCode) {
            setCouponError("Vui lòng nhập mã giảm giá");
            return;
        }

        try {
            const res = await axiosInstance.post("/api/client/checkout/apply_coupon", {
                voucher_code: voucherCode,
            });

            if (res.data.status) {
                setAppliedCoupon(res.data.data);
                setCouponError("");
                notification.success({message: res.data.message || "Áp mã giảm giá thành công"});
            } else {
                setCouponError(res.data.message || "Mã giảm giá không hợp lệ");
                notification.error({message: res.data.message || "Mã giảm giá không hợp lệ"});
            }
        } catch (e: any) {
            const errorMessage =
                e.response?.data?.errors?.voucher_code?.[0] ||
                e.response?.data?.message ||
                e.message ||
                "Lỗi khi áp mã giảm giá";

            setCouponError(errorMessage);
            notification.error({message: errorMessage});
        }
    };

    const cancelCoupon = () => {
        setAppliedCoupon(null);
        setVoucherCode("");
        setCouponError("");
        notification.success({message: "Đã hủy mã giảm giá"});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setFormErrors((prev) => ({...prev, [name]: ""}));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({...prev, [name]: value}));
        setFormErrors((prev) => ({...prev, [name]: ""}));

        if (name === "province") {
            setFormData((prev) => ({...prev, district: "", ward: ""}));
            setDistricts([]);
            setWards([]);
            if (value) fetchDistricts(value);
        } else if (name === "district") {
            setFormData((prev) => ({...prev, ward: ""}));
            setWards([]);
            if (value) fetchWards(value);
        }
    };

    const handleAddressChange = (addressId: number | null) => {
        setSelectedAddressId(addressId);
        setFormErrors((prev) => ({ ...prev, address_selection: "" }));
        setShippingFee(0);
        if (addressId === null) {
            setUseNewAddress(true);
        } else {
            setUseNewAddress(false);
            const selectedAddress = addresses.find((addr) => addr.id === addressId);
            if (selectedAddress) {
                setFormData((prev) => ({
                    ...prev,
                    recipient_name: selectedAddress.recipient_name,
                    recipient_phone: selectedAddress.recipient_phone,
                    recipient_email: selectedAddress.recipient_email,
                    detailed_address: "",
                    province: "",
                    district: "",
                    ward: "",
                }));
            }
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        setFormData((prev) => ({...prev, payment_method: value}));
        setFormErrors((prev) => ({...prev, payment_method: ""}));
    };

    const validateForm = (data: any, useNewAddress: boolean) => {
        const errors = {
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            province: "",
            district: "",
            ward: "",
            detailed_address: "",
            payment_method: "",
            address_selection: "",
        };
        let isValid = true;

        if (useNewAddress) {
            if (!data.province) {
                errors.province = "Vui lòng chọn tỉnh/thành phố";
                isValid = false;
            }
            if (!data.district) {
                errors.district = "Vui lòng chọn quận/huyện";
                isValid = false;
            }
            if (!data.ward) {
                errors.ward = "Vui lòng chọn phường/xã";
                isValid = false;
            }
            if (!data.detailed_address.trim()) {
                errors.detailed_address = "Vui lòng nhập địa chỉ chi tiết";
                isValid = false;
            }
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
        } else if (!selectedAddressId) {
            errors.address_selection = "Vui lòng chọn địa chỉ giao hàng";
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
        const {isValid, errors} = validateForm(formData, useNewAddress);
        if (!isValid) {
            setFormErrors(errors);
            notification.error({message: "Vui lòng kiểm tra thông tin nhập"});
            return;
        }

        let shipping_address = "";
        if (useNewAddress) {
            const provinceName = provinces.find((p) => p.ProvinceID === formData.province)?.ProvinceName || "";
            const districtName = districts.find((d) => d.DistrictID === formData.district)?.DistrictName || "";
            const wardName = wards.find((w) => w.WardCode === formData.ward)?.WardName || "";
            shipping_address = `${formData.detailed_address}, ${wardName}, ${districtName}, ${provinceName}`;
        }

        try {
            const payload = {
                recipient_name: formData.recipient_name ?? profile.name,
                recipient_phone: formData.recipient_phone ?? profile.customer.phone,
                recipient_email: formData.recipient_email ?? profile.email,
                ...(useNewAddress ? {shipping_address} : {address_id: selectedAddressId}),
                note: formData.note,
                payment_method: formData.payment_method,
                voucher_code: appliedCoupon ? appliedCoupon.voucher_code : "",
            };
            const res = await axiosInstance.post("/api/client/orders", payload);
            if (res.data.status) {
                notification.success({message: res.data.message || "Đặt hàng thành công"});
                navigate("/don-hang-cua-toi");
            } else {
                notification.error({message: res.data.message || "Lỗi khi đặt hàng"});
            }
        } catch (e: any) {
            notification.error({message: e.message || "Lỗi khi đặt hàng"});
        }
    };

    const baseTotal = appliedCoupon ? appliedCoupon.final_price : cartData.total;
    const displayTotal = baseTotal + shippingFee;

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
                                                    <div className="form-group mb-3">
                                                        <label className="form-label fw-medium">
                                                            Chọn địa chỉ giao hàng <span
                                                            className="text-danger">*</span>
                                                        </label>
                                                        <div className="d-flex flex-column gap-2">
                                                            {loading ? (
                                                                <Skeleton active/>
                                                            ) : addresses.length > 0 ? (
                                                                addresses.map((address) => (
                                                                    <div key={address.id} className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="radio"
                                                                            name="address"
                                                                            id={`address_${address.id}`}
                                                                            value={address.id}
                                                                            checked={selectedAddressId === address.id}
                                                                            onChange={() => handleAddressChange(address.id)}
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor={`address_${address.id}`}
                                                                        >
                                                                            <strong>{address.recipient_name}</strong> - {address.recipient_phone} - {address.recipient_email} <br/> {address.address}
                                                                        </label>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted">Chưa có địa chỉ nào được
                                                                    lưu.</p>
                                                            )}
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="address"
                                                                    id="new_address"
                                                                    checked={useNewAddress}
                                                                    onChange={() => handleAddressChange(null)}
                                                                />
                                                                <label className="form-check-label"
                                                                       htmlFor="new_address">
                                                                    Nhập địa chỉ khác
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {formErrors.address_selection && (
                                                            <div
                                                                className="text-danger small">{formErrors.address_selection}</div>
                                                        )}
                                                    </div>

                                                    {useNewAddress && (
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
                                                                        placeholder="Họ và tên"
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
                                                                        placeholder="Số điện thoại"
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
                                                                        Tỉnh/Thành phố <span
                                                                        className="text-danger">*</span>
                                                                    </label>
                                                                    <Select
                                                                        className="w-100"
                                                                        placeholder="Chọn tỉnh/thành phố"
                                                                        value={formData.province || undefined}
                                                                        onChange={(value) => handleSelectChange("province", value)}
                                                                        showSearch
                                                                        filterOption={(input, option) =>
                                                                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                    >
                                                                        {provinces.map((province) => (
                                                                            <Option key={province.ProvinceID}
                                                                                    value={province.ProvinceID}>
                                                                                {province.ProvinceName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                    {formErrors.province && (
                                                                        <div
                                                                            className="text-danger small">{formErrors.province}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div className="form-group">
                                                                    <label className="form-label fw-medium">
                                                                        Quận/Huyện <span
                                                                        className="text-danger">*</span>
                                                                    </label>
                                                                    <Select
                                                                        className="w-100"
                                                                        placeholder="Chọn quận/huyện"
                                                                        value={formData.district || undefined}
                                                                        onChange={(value) => handleSelectChange("district", value)}
                                                                        showSearch
                                                                        filterOption={(input, option) =>
                                                                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                        disabled={!formData.province}
                                                                    >
                                                                        {districts.map((district) => (
                                                                            <Option key={district.DistrictID}
                                                                                    value={district.DistrictID}>
                                                                                {district.DistrictName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                    {formErrors.district && (
                                                                        <div
                                                                            className="text-danger small">{formErrors.district}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div className="form-group">
                                                                    <label className="form-label fw-medium">
                                                                        Phường/Xã <span className="text-danger">*</span>
                                                                    </label>
                                                                    <Select
                                                                        className="w-100"
                                                                        placeholder="Chọn phường/xã"
                                                                        value={formData.ward || undefined}
                                                                        onChange={(value) => handleSelectChange("ward", value)}
                                                                        showSearch
                                                                        filterOption={(input, option) =>
                                                                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                        disabled={!formData.district}
                                                                    >
                                                                        {wards.map((ward) => (
                                                                            <Option key={ward.WardCode}
                                                                                    value={ward.WardCode}>
                                                                                {ward.WardName}
                                                                            </Option>
                                                                        ))}
                                                                    </Select>
                                                                    {formErrors.ward && (
                                                                        <div
                                                                            className="text-danger small">{formErrors.ward}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12">
                                                                <div className="form-group">
                                                                    <label className="form-label fw-medium">
                                                                        Địa chỉ chi tiết <span
                                                                        className="text-danger">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="detailed_address"
                                                                        value={formData.detailed_address}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Nhập địa chỉ chi tiết"
                                                                    />
                                                                    {formErrors.detailed_address && (
                                                                        <div
                                                                            className="text-danger small">{formErrors.detailed_address}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="col-lg-12 mt-3">
                                                        <div className="form-group">
                                                            <label className="form-label fw-medium">Ghi chú</label>
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
                                                                {Object.entries(paymentMethodMap).map(([key, {
                                                                    label,
                                                                    color,
                                                                    icon
                                                                }]) => (
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
                                                                            style={{color}}
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
                                                                    <th className="fw-medium text-start">Sản phẩm</th>
                                                                    <th className="fw-medium text-end">Tổng tiền</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {cartData.items.map((item) => (
                                                                    <tr key={item.id} className="align-middle">
                                                                        <td className="text-start">
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                <img
                                                                                    src={item.image || "/path/to/fallback-image.jpg"}
                                                                                    alt={item.product_name}
                                                                                    className="rounded"
                                                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                                                />
                                                                                <div>
                                                                                    <Link
                                                                                        to={`/chi-tiet-san-pham/${item.product_id}`}
                                                                                        className="text-dark fw-medium"
                                                                                    >
                                                                                        {item.product_name}
                                                                                    </Link>
                                                                                    <p className="text-muted small mb-0">
                                                                                        Phân loại: {item.size}, {item.color}
                                                                                    </p>
                                                                                    <p className="text-muted small mb-0">Số lượng: {item.quantity}</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-end">
                                                                            <span className="fw-bold">{convertToInt(item.total)}₫</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                                <tfoot>
                                                                <tr>
                                                                    <th className="text-start">Tổng tiền sản phẩm</th>
                                                                    <td className="text-end">
                                                                        <span className="fw-bold">{convertToInt(cartData.total)}₫</span>
                                                                    </td>
                                                                </tr>
                                                                {appliedCoupon && (
                                                                    <tr>
                                                                        <th className="text-start">Giảm giá ({appliedCoupon.voucher_code})</th>
                                                                        <td className="text-end">
                                                                            <span className="text-success">-{convertToInt(appliedCoupon.discount_amount)}₫</span>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                                <tr>
                                                                    <th className="text-start">Phí vận chuyển</th>
                                                                    <td className="text-end">
                                                                        <span className="fw-bold">{shippingFee > 0 ? convertToInt(shippingFee.toString()) + "₫" : "Đang tính phí vận chuyển"}</span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className="text-start">Tổng cộng</th>
                                                                    <td className="text-end">
                                                                        <strong className="text-original-base fs-5">{convertToInt(displayTotal)}₫</strong>
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
                                                                    value={voucherCode}
                                                                    onChange={(e) => setVoucherCode(e.target.value)}
                                                                    disabled={!!appliedCoupon}
                                                                />
                                                                {appliedCoupon ? (
                                                                    <button className="btn btn-outline-danger" type="button" onClick={cancelCoupon}>
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
                                                            {couponError && <div className="text-danger mb-3">{couponError}</div>}
                                                        </div>

                                                        <button
                                                            className="btn bg-original-base text-white w-100 mt-3 py-2 fw-medium"
                                                            onClick={handleSubmit}
                                                        >
                                                            Đặt hàng
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="mt-3 fs-6">Chưa có sản phẩm nào trong giỏ hàng!</p>
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
};