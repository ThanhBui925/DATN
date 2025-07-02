import {Search} from "./sidebar/Search";
import {Category} from "./sidebar/Category";
import {RecentBlog} from "./sidebar/RecentBlog";
import {Tag} from "./sidebar/Tag";

interface SidebarBlogProps {
    onSearch: (keyword: string) => void;
}
export const SidebarBlog = ({ onSearch }: SidebarBlogProps) => {
    return (
        <div className="col-lg-3 order-2 order-lg-1">
            <Search onSearch={onSearch} />
            <Category/>
            <RecentBlog/>
            <Tag/>
        </div>
    )
}