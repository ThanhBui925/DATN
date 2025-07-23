import {Link} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {notification} from "antd";
import {useLogin} from "@refinedev/core";

export const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    const { mutate: login } = useLogin();

    const handleSubmit = async  (e: React.FormEvent) => {
        setIsLoading(true)
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setIsLoading(false)
            return;
        }
        try {
            await axios.get(import.meta.env.VITE_APP_API_URL + "/sanctum/csrf-cookie");
            const response = await axios.post(import.meta.env.VITE_APP_API_URL + "/api/register", {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });
            if (response.data.token) {
                notification.success({message: 'Đăng ký thành công, đang đăng nhập ...!'})
                login({ email, password });
            } else {
                notification.error({message: response?.data?.errors[0]})
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                notification.error({ message: err.response.data.message});
            } else {
                notification.error({ message: "Đăng ký thất bại. Vui lòng thử lại!"});
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="content-wraper">
            <div className="container-fluid banner_register_form align-content-center">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 ml-5">
                        <div className="customer-login-register">
                            <div className="login-Register-info">
                                <h3>Đăng ký thành viên</h3>
                                <form onSubmit={handleSubmit}>
                                    {error && (
                                        <p className="text-danger">
                                            {error}
                                        </p>
                                    )}
                                    <p className="coupon-input form-row-first">
                                        <label>Họ và tên <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            required={true}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </p>
                                    <p className="coupon-input form-row-first">
                                        <label>Email <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="email"
                                            required={true}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </p>
                                    <p className="coupon-input form-row-last position-relative">
                                        <label>Mật khẩu <span className="required">*</span></label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required={true}
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        />
                                        <span
                                            className="position-absolute end-0 translate-middle-y me-3 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{cursor: 'pointer', marginTop: '20px'}}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-eye-slash"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                </svg>
                                            )}
                                        </span>
                                    </p>
                                    <p className="coupon-input form-row-last position-relative">
                                        <label>Xác nhận mật khẩu <span className="required">*</span></label>
                                        <input
                                            type={showCfPassword ? "text" : "password"}
                                            required={true}
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span
                                            className="position-absolute end-0 translate-middle-y me-3 cursor-pointer"
                                            onClick={() => setShowCfPassword(!showCfPassword)}
                                            style={{cursor: 'pointer', marginTop: '20px'}}
                                        >
                                            {showCfPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-eye-slash"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                    <path
                                                        d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                    <path
                                                        d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                </svg>
                                            )}
                                        </span>
                                    </p>
                                    <div className="clear"></div>
                                    <p>
                                        <button className="button-login" type="submit" disabled={isLoading}>
                                            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                                        </button>
                                    </p>
                                </form>
                                <div className="d-flex gap-2">
                                    <span>Đã có tài khoản? </span>
                                    <Link to="/dang-nhap" className="text-original-base fw-bold">
                                        Đăng nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
