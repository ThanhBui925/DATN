import {ProfileSidebar} from "../components/auth/profile/ProfileSidebar";
import {OrderDetailContent} from "../components/order/OrderDetailContent";

export const OrderDetail = () => {
    return (
        <div className="content-wraper mt-95 mb-5">
            <div className="container-fluid">
                <div className={`row`}>
                    <ProfileSidebar/>
                    <OrderDetailContent/>
                </div>
            </div>
        </div>
    )
}