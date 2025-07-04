import {ProfileSidebar} from "../../components/auth/profile/ProfileSidebar";
import {ProfileContent} from "../../components/auth/profile/ProfileContent";

export const Profile = () => {
    return (
        <div className="content-wraper mt-95 mb-5">
            <div className="container-fluid">
                <div className={`row`}>
                    <ProfileSidebar/>
                    <ProfileContent/>
                </div>
            </div>
        </div>
    )
}