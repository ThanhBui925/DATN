import {SidebarBlog} from "../components/blog/SidebarBlog";
import {DetailBlog} from "../components/blog/DetailBlog";

export const DetailBlogPage = () => {
    return (
        <div className="content-wraper">
            <div className="container-fluid">
                <div className="row">
                    <SidebarBlog/>
                    <DetailBlog/>
                </div>
            </div>
        </div>
    )
}