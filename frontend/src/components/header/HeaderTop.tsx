import {axiosInstance} from "../../utils/axios";
import {Link} from "react-router-dom";
import {notification} from "antd";
import {TOKEN_KEY} from "../../providers/authProvider";

export const HeaderTop = () => {

    const isAuth = localStorage.getItem(TOKEN_KEY) || false;
    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post('/api/logout')
            if (res.data.success) {
                localStorage.removeItem(TOKEN_KEY);
                notification.success({message: "Đăng xuất thành công"})
            } else {
                notification.error({message: "Không thể đăng xuất"})
            }
        } catch (e) {
            notification.error({message: (e as Error).message})
        }
    }

    return (
            <div className="header-top bg-black">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-4">
                            <div className="welcome-msg">
                                <p>Chào mừng đến với bình nguyên vô tận !</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-8">
                            <div className="full-setting-area">
                                <div className="top-dropdown">
                                    <ul>
                                        <li className="drodown-show"><span>Tiền tệ:</span> <a href="#">VNĐ
                                            {/*<i className="fa fa-angle-down"></i>*/}
                                        </a>
                                            <ul className="open-dropdown">
                                                <li><a href="#">EUR €</a></li>
                                                <li><a href="#">USD $</a></li>
                                            </ul>
                                        </li>
                                        <li className="drodown-show"><span>Ngôn ngữ:</span> <a href="#"><img
                                            src="/img/icon/vn_flag.png" style={{ height: 15, width: 20}} alt=""/> Tiếng Việt
                                            {/*<i className="fa fa-angle-down"></i>*/}
                                        </a>
                                            <ul className="open-dropdown">
                                                <li><a href="#"><img src="img/icon/p-1.jpg" alt=""/> English</a></li>
                                                <li><a href="#"><img src="img/icon/p-2.jpg" alt=""/> Français</a></li>
                                            </ul>
                                        </li>
                                        {
                                            isAuth ? (
                                                <li className="drodown-show"><a href="#"> LeeHieu123 <i
                                                    className="fa fa-angle-down"></i></a>
                                                    <ul className="open-dropdown setting">
                                                        <li><Link to={`tai-khoan-cua-toi`}>Tài khoản của tôi</Link></li>
                                                        <li><Link to="checkout.html">Đơn mua</Link></li>
                                                        <li><Link to={'#'} onClick={handleLogout}>Đăng xuất</Link></li>
                                                    </ul>
                                                </li>
                                            ) : (
                                                <li><Link to="/dang-nhap"> Đăng nhập </Link></li>
                                            )
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}