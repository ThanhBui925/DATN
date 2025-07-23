import React, { useEffect, useState, FormEvent } from 'react';
import { TOKEN_KEY } from "../../../providers/authProvider";
import { notification } from "antd";
import { axiosInstance } from "../../../utils/axios";

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    status: number;
    customer: {
        id: number;
        user_id: number;
        phone: string;
        address: string;
        avatar: string | null;
        dob: string | null;
        gender: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

export const ProfileContent = () => {
    const isAuth = !!localStorage.getItem(TOKEN_KEY);
    const [profile, setProfile] = useState<UserData | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [gender, setGender] = useState<string | null>(null);
    const [dob, setDob] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isAuth) {
            const fetchProfile = async () => {
                try {
                    const res = await axiosInstance.get("/api/profile");
                    if (res.data.status) {
                        setProfile(res.data.data);
                        setName(res.data.data.name);
                        setPhone(res.data.data.customer.phone || '');
                        setGender(res.data.data.customer.gender || null);
                        setDob(res.data.data.customer.dob || '');
                        if (res.data.data.customer.avatar) {
                            setPreviewImage(res.data.data.customer.avatar);
                        }
                    } else {
                        notification.error({ message: res.data.message || "Lỗi khi tải thông tin profile" });
                    }
                } catch (e) {
                    notification.error({ message: (e as Error).message || "Lỗi khi tải thông tin profile" });
                }
            };
            fetchProfile();
        }
    }, [isAuth]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                notification.error({ message: "Dung lượng file tối đa là 1MB" });
                return;
            }
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                notification.error({ message: "Chỉ hỗ trợ định dạng JPEG, PNG" });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        if (gender) formData.append('gender', gender);
        if (dob) formData.append('dob', dob);
        if (imageFile) formData.append('avatar', imageFile);

        try {
            const res = await axiosInstance.post("/api/profile", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.status) {
                notification.success({ message: "Cập nhật thông tin thành công" });
                setProfile(prev => prev ? { ...prev, name, customer: { ...prev.customer, phone, gender, dob, avatar: previewImage || prev.customer.avatar } } : null);
            } else {
                notification.error({ message: res.data.message || "Cập nhật thông tin thất bại" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message || "Lỗi khi cập nhật thông tin" });
        }
    };

    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content">
                <div className="container">
                    <div className="card mb-4 shadow-lg border-0 rounded-3 overflow-hidden p-4">
                        <h2 className="text-center mb-4">Hồ Sơ Của Tôi</h2>
                        <p className="text-center text-muted mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={profile?.email} readOnly />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Giới tính</label>
                                <div className="d-flex gap-3">
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="gender" value="Nam" checked={gender === 'Nam'} onChange={() => setGender('Nam')} />
                                        <label className="form-check-label">Nam</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="gender" value="Nữ" checked={gender === 'Nữ'} onChange={() => setGender('Nữ')} />
                                        <label className="form-check-label">Nữ</label>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ngày sinh</label>
                                <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} />
                            </div>

                            <div className="mb-3 d-flex align-items-center gap-3">
                                <div>
                                    <label className="form-label">Ảnh đại diện</label>
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 150, height: 150 }}>
                                        {previewImage ? (
                                            <img src={previewImage} alt="Avatar" className="rounded-circle object-fit-cover" style={{ height: 150 }} />
                                        ) : (
                                            <span className="text-muted">No image</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="form-control d-none" id="imageUpload" />
                                    <label htmlFor="imageUpload" className="btn btn-outline-secondary mb-1">Chọn Ảnh</label>
                                    <p className="text-muted small mb-0">Dung lượng file tối đa 1 MB<br />Định dạng: JPEG, PNG</p>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-danger w-25">Lưu</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};