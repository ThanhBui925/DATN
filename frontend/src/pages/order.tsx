import {ProfileSidebar} from "../components/auth/profile/ProfileSidebar";
import {OrderContent} from "../components/order/OrderContent";
import {Breadcrumb} from "../components/Breadcrumb";

export const Order = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Đơn hàng",
    };
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95 mb-5">
                <div className="container-fluid">
                    <div className={`row`}>
                        <ProfileSidebar/>
                        <OrderContent/>
                    </div>
                </div>
            </div>
        </>
    )
}