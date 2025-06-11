import {SidebarBlog} from "../components/blog/SidebarBlog";
import {BlogList} from "../components/blog/BlogList";
import {Breadcrumb} from "../components/Breadcrumb";

export const ListBlogPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Bài viết",
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper">
                <div className="container-fluid">
                    <div className="row">
                        <SidebarBlog/>
                        <BlogList/>
                    </div>
                </div>
            </div>
        </>
    )
}