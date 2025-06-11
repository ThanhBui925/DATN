import {SidebarBlog} from "../components/blog/SidebarBlog";
import {BlogList} from "../components/blog/BlogList";

export const ListBlogPage = () => {
    return (
        <div className="content-wraper">
            <div className="container-fluid">
                <div className="row">
                    <SidebarBlog/>
                    <BlogList/>
                </div>
            </div>
        </div>
    )
}