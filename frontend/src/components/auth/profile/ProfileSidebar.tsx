import { Link, useLocation } from "react-router-dom";
import { TOKEN_KEY } from "../../../providers/authProvider";
import { axiosInstance } from "../../../utils/axios";
import { notification } from "antd";

export const ProfileSidebar = () => {
    const location = useLocation();
    const handleLogout = async () => {
        try {
            const res = await axiosInstance.post('/api/logout');
            if (res.data.success) {
                localStorage.removeItem(TOKEN_KEY);
                notification.success({ message: "Đăng xuất thành công" });
            } else {
                notification.error({ message: "Không thể đăng xuất" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
    };

    return (
        <div className="col-md-12 col-lg-2">
            <ul className="nav flex-column dashboard-list" role="tablist">
                <li>
                    <Link
                        to={'/don-hang-cua-toi'}
                        className={`nav-link ${location.pathname === '/don-hang-cua-toi' ? 'active' : ''}`}
                    >
                        Đơn hàng
                    </Link>
                </li>
                <li>
                    <Link
                        to={'/dia-chi'}
                        className={`nav-link ${location.pathname === '/dia-chi' ? 'active' : ''}`}
                    >
                        Địa chỉ
                    </Link>
                </li>
                <li>
                    <Link
                        to={'/tai-khoan-cua-toi'}
                        className={`nav-link ${location.pathname === '/tai-khoan-cua-toi' ? 'active' : ''}`}
                    >
                        Chi tiết tài khoản
                    </Link>
                </li>
                <li>
                    <Link
                        to={'#'}
                        onClick={handleLogout}
                        className={`nav-link ${location.pathname === '#' ? 'active' : ''}`}
                    >
                        Đăng xuất
                    </Link>
                </li>
            </ul>
        </div>
    );
};