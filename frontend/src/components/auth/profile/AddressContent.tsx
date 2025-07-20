import {useEffect, useState} from "react";
import {notification, Select, Skeleton} from "antd";
import {axiosInstance} from "../../../utils/axios";
import {axiosGHNInstance} from "../../../utils/axios_ghn";
import {TOKEN_KEY} from "../../../providers/authProvider";

const {Option} = Select;

interface Address {
    id: number;
    recipient_name: string;
    recipient_phone: string;
    recipient_email: string;
    province_name: string;
    district_name: string;
    ward_name: string;
    address: string;
    is_default: boolean;
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

export const AddressContent = () => {
    const isAuth = !!localStorage.getItem(TOKEN_KEY);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        province: "",
        district: "",
        ward: "",
        detailed_address: "",
        is_default: false,
    });
    const [formErrors, setFormErrors] = useState({
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        province: "",
        district: "",
        ward: "",
        detailed_address: "",
    });

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/addresses");
            if (res.data.status) {
                setAddresses(res.data.data || []);
                const defaultAddress = res.data.data.find((addr: Address) => addr.is_default);
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress.id);
                }
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
            if (res.data.message === "Success") {
                setProvinces(res.data.data);
            }
        } catch (e) {
            notification.error({message: "Lỗi khi tải danh sách tỉnh/thành phố"});
        }
    };

    const fetchDistricts = async (provinceId: string) => {
        try {
            const res = await axiosGHNInstance(`/district?province_id=${provinceId}`);
            if (res.data.message === "Success") {
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
            if (res.data.message === "Success") {
                setWards(res.data.data);
            }
        } catch (e) {
            notification.error({message: "Lỗi khi tải danh sách phường/xã"});
        }
    };

    useEffect(() => {
        if (isAuth) {
            fetchAddresses();
            fetchProvinces();
        }
    }, [isAuth]);

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

    const handleAddressChange = (addressId: number) => {
        setSelectedAddressId(addressId);
        const selectedAddress = addresses.find((addr) => addr.id === addressId);
        if (selectedAddress) {
            setFormData({
                recipient_name: selectedAddress.recipient_name,
                recipient_phone: selectedAddress.recipient_phone,
                recipient_email: selectedAddress.recipient_email,
                province: selectedAddress.province_name,
                district: selectedAddress.district_name,
                ward: selectedAddress.ward_name,
                detailed_address: selectedAddress.address,
                is_default: selectedAddress.is_default,
            });
            setIsEditing(true);
        }
    };

    const handleAddNewAddress = () => {
        setSelectedAddressId(null);
        setIsEditing(true);
        setFormData({
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            province: "",
            district: "",
            ward: "",
            detailed_address: "",
            is_default: false,
        });
    };

    const validateForm = () => {
        const errors = {
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            province: "",
            district: "",
            ward: "",
            detailed_address: "",
        };
        let isValid = true;

        if (!formData.recipient_name.trim()) {
            errors.recipient_name = "Vui lòng nhập họ và tên";
            isValid = false;
        }
        if (!formData.recipient_phone.trim()) {
            errors.recipient_phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.recipient_phone.trim())) {
            errors.recipient_phone = "Số điện thoại không hợp lệ";
            isValid = false;
        }
        if (!formData.recipient_email.trim()) {
            errors.recipient_email = "Vui lòng nhập email";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipient_email.trim())) {
            errors.recipient_email = "Email không hợp lệ";
            isValid = false;
        }
        if (!formData.province) {
            errors.province = "Vui lòng chọn tỉnh/thành phố";
            isValid = false;
        }
        if (!formData.district) {
            errors.district = "Vui lòng chọn quận/huyện";
            isValid = false;
        }
        if (!formData.ward) {
            errors.ward = "Vui lòng chọn phường/xã";
            isValid = false;
        }
        if (!formData.detailed_address.trim()) {
            errors.detailed_address = "Vui lòng nhập địa chỉ chi tiết";
            isValid = false;
        }

        return {isValid, errors};
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {isValid, errors} = validateForm();
        if (!isValid) {
            setFormErrors(errors);
            notification.error({message: "Vui lòng kiểm tra thông tin nhập"});
            return;
        }

        const provinceName = provinces.find((p) => p.ProvinceID === formData.province)?.ProvinceName || "";
        const districtName = districts.find((d) => d.DistrictID === formData.district)?.DistrictName || "";
        const wardName = wards.find((w) => w.WardCode === formData.ward)?.WardName || "";

        try {
            const payload = {
                recipient_name: formData.recipient_name,
                recipient_phone: formData.recipient_phone,
                recipient_email: formData.recipient_email,
                province_name: provinceName,
                district_name: districtName,
                ward_name: wardName,
                address: formData.detailed_address,
                is_default: formData.is_default,
            };

            const res = isEditing && selectedAddressId
                ? await axiosInstance.put(`/api/client/addresses/${selectedAddressId}`, payload)
                : await axiosInstance.post("/api/client/addresses", payload);

            if (res.data.status) {
                notification.success({message: isEditing ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công"});
                fetchAddresses();
                setIsEditing(false);
                setSelectedAddressId(null);
                setFormData({
                    recipient_name: "",
                    recipient_phone: "",
                    recipient_email: "",
                    province: "",
                    district: "",
                    ward: "",
                    detailed_address: "",
                    is_default: false,
                });
            } else {
                notification.error({message: res.data.message || "Lỗi khi lưu địa chỉ"});
            }
        } catch (e) {
            notification.error({message: (e as Error).message || "Lỗi khi lưu địa chỉ"});
        }
    };

    const handleDeleteAddress = async (addressId: number) => {
        try {
            const res = await axiosInstance.delete(`/api/client/addresses/${addressId}`);
            if (res.data.status) {
                notification.success({message: "Xóa địa chỉ thành công"});
                fetchAddresses();
                if (selectedAddressId === addressId) {
                    setSelectedAddressId(null);
                    setIsEditing(false);
                }
            } else {
                notification.error({message: res.data.message || "Lỗi khi xóa địa chỉ"});
            }
        } catch (e) {
            notification.error({message: (e as Error).message || "Lỗi khi xóa địa chỉ"});
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedAddressId(null);
        setFormData({
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            province: "",
            district: "",
            ward: "",
            detailed_address: "",
            is_default: false,
        });
        setFormErrors({
            recipient_name: "",
            recipient_phone: "",
            recipient_email: "",
            province: "",
            district: "",
            ward: "",
            detailed_address: "",
        });
    };

    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content">
                <div className="container">
                    <div className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden p-4">
                        <div id="address" className="tab-pane fade show active">
                            <h3 className="fw-bold mb-4 text-dark">Quản lý địa chỉ</h3>
                            <p>Chọn địa chỉ mặc định hoặc thêm địa chỉ mới để sử dụng khi thanh toán.</p>

                            <div className="card shadow-sm border-0 rounded-3 mb-4">
                                <div className="card-body p-4">
                                    <h4 className="mb-3">Danh sách địa chỉ</h4>
                                    {loading ? (
                                        <Skeleton active/>
                                    ) : addresses.length > 0 ? (
                                        <div className="d-flex flex-column gap-2">
                                            {addresses.map((address) => (
                                                <div key={address.id}
                                                     className="form-check d-flex align-items-center gap-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="address"
                                                        id={`address_${address.id}`}
                                                        value={address.id}
                                                        checked={selectedAddressId === address.id}
                                                        onChange={() => handleAddressChange(address.id)}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor={`address_${address.id}`}>
                                                        <strong>{address.recipient_name}</strong> - {address.recipient_phone} - {address.recipient_email}
                                                        <br/>
                                                        {address.address}, {address.ward_name}, {address.district_name}, {address.province_name} {address.is_default &&
                                                        <span className="badge bg-success">Mặc định</span>}
                                                    </label>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm ms-auto"
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted">Chưa có địa chỉ nào được lưu.</p>
                                    )}
                                    <button
                                        className="btn btn-outline-primary mt-3"
                                        onClick={handleAddNewAddress}
                                    >
                                        Thêm địa chỉ mới
                                    </button>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="card shadow-sm border-0 rounded-3">
                                    <div className="card-body p-4">
                                        <h4 className="mb-3">{selectedAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}</h4>
                                        <form onSubmit={handleSubmit}>
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
                                                            Số điện thoại <span className="text-danger">*</span>
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
                                                            Tỉnh/Thành phố <span className="text-danger">*</span>
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
                                                            Quận/Huyện <span className="text-danger">*</span>
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
                                                                <Option key={ward.WardCode} value={ward.WardCode}>
                                                                    {ward.WardName}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                        {formErrors.ward && (
                                                            <div className="text-danger small">{formErrors.ward}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group">
                                                        <label className="form-label fw-medium">
                                                            Địa chỉ chi tiết <span className="text-danger">*</span>
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
                                                <div className="col-lg-12">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="is_default"
                                                            checked={formData.is_default}
                                                            onChange={(e) => setFormData((prev) => ({
                                                                ...prev,
                                                                is_default: e.target.checked
                                                            }))}
                                                        />
                                                        <label className="form-check-label">Đặt làm địa chỉ mặc
                                                            định</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 mt-4">
                                                <button type="submit" className="btn bg-original-base text-white">
                                                    {selectedAddressId ? "Cập nhật" : "Thêm"} địa chỉ
                                                </button>
                                                <button type="button" className="btn btn-outline-secondary"
                                                        onClick={handleCancel}>
                                                    Hủy
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};