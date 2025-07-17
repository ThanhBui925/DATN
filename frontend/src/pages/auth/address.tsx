import {ProfileSidebar} from "../../components/auth/profile/ProfileSidebar";
import {AddressContent} from "../../components/auth/profile/AddressContent";
import {Breadcrumb} from "../../components/Breadcrumb";

export const Address = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Địa chỉ",
    };
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95 mb-5">
                <div className="container-fluid">
                    <div className={`row`}>
                        <ProfileSidebar/>
                        <AddressContent/>
                    </div>
                </div>
            </div>
        </>
    )
}