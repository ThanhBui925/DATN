import {Search} from "./sidebar/Search";
import {Category} from "./sidebar/Category";
import {RecentBlog} from "./sidebar/RecentBlog";
import {Tag} from "./sidebar/Tag";

export const SidebarBlog = () => {
    return (
        <div className="col-lg-3 order-2 order-lg-1">
            <Search/>
            <Category/>
            <RecentBlog/>
            <Tag/>
        </div>
    )
}