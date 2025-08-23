import {Link} from "react-router-dom";
import {useState} from "react";
import {axiosInstance} from "../../../utils/axios";
import {notification} from "antd";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await axiosInstance.post('/api/forgot-password', {email});
            notification.success({message: "Vui lòng kiểm tra email để đổi mật khẩu!"});
            setTimeout(() => {
                window.open('https://mail.google.com/', '_blank');
            }, 3000)
        } catch (error: any) {
            if (error.response?.status === 422) {
                notification.error({message: "Email không tồn tại trong hệ thống!"});
            } else {
                notification.error({message: "Đã xảy ra lỗi, vui lòng thử lại sau!"});
            }
            console.error('Lỗi:', error);
        }
    };


    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-sm-flex gap-4 justify-content-sm-start">
                                <a href="/trang-chu">
                                    <img className={`mt-2`} style={{height: 50}} src="/img/logo/logo.png" alt=""/>
                                </a>
                                <hr className={`d-block d-sm-none text-danger`}/>
                                <h1 className="cE_Tbx text-original-base mt-2 mt-sm-0">Quên mật khẩu</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-wraper">
                <div className="container-fluid banner_login_form align-content-center">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <div className="customer-login-register">
                                <div className="login-Register-info">
                                    <h3>Quên mật khẩu</h3>
                                    <form onSubmit={handleSubmit}>
                                        <p className="coupon-input form-row-first">
                                            <label>Email <span className="required">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                required={true}
                                                value={email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            />
                                        </p>
                                        <p>
                                            <button
                                                className="button-login"
                                                type="submit"
                                            >
                                                Gửi email
                                            </button>
                                        </p>
                                        <div className="d-flex gap-2">
                                            <span>Đã có tài khoản? </span>
                                            <Link to="/dang-nhap" className="text-original-base fw-bold">
                                                Đăng nhập
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};