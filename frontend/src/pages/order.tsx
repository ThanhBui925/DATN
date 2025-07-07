import {ProfileSidebar} from "../components/auth/profile/ProfileSidebar";
import {OrderContent} from "../components/order/OrderContent";

export const Order = () => {
    return (
        <div className="content-wraper mt-95 mb-5">
            <div className="container-fluid">
                <div className={`row`}>
                    <ProfileSidebar/>
                    <OrderContent/>
                </div>
            </div>
        </div>
    )
}