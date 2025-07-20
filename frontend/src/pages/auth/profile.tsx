import {ProfileSidebar} from "../../components/auth/profile/ProfileSidebar";
import {ProfileContent} from "../../components/auth/profile/ProfileContent";
import {Breadcrumb} from "../../components/Breadcrumb";

export const Profile = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Thông tin cá nhân",
    };
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95 mb-5">
                <div className="container-fluid">
                    <div className={`row`}>
                        <ProfileSidebar/>
                        <ProfileContent/>
                    </div>
                </div>
            </div>
        </>
    )
}