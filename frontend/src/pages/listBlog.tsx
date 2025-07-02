import {SidebarBlog} from "../components/blog/SidebarBlog";
import {BlogList} from "../components/blog/BlogList";
import {Breadcrumb} from "../components/Breadcrumb";
import {useState} from "react";

export const ListBlogPage = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
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
                        <SidebarBlog onSearch={setSearchKeyword} />
                        <BlogList keyword={searchKeyword}/>
                    </div>
                </div>
            </div>
        </>
    )
}