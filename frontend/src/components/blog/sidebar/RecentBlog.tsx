import {useEffect, useState} from "react";
import axios from "axios";
import {Skeleton} from "antd";
import {SingleBlog} from "../SingleBlog";
import {Link} from "react-router-dom";
import {convertDate} from "../../../helpers/common";

export const RecentBlog = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [blogs, setBlogs] = useState([]);
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/client/five-blog-latest`
            );
            setBlogs(res.data.data ?? [])
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="single-categories-1 recent-post">
            <h3 className="blog-categorie-title">Bài viết mới nhất</h3>
            <div className="all-recent-post">
                {loading ? (
                    <Skeleton/>
                ) : (
                    (blogs && blogs.length > 0) ? (
                        blogs.map((blog: any) => (
                            <div className="single-recent-post">
                                <div className="recent-img">
                                    <Link to={'/chi-tiet-bai-viet/1'}>
                                        <img alt={blog.title} src={blog.image}/>
                                    </Link>
                                </div>
                                <div className="recent-desc">
                                    <h6><Link to={'/chi-tiet-bai-viet/1'}>{blog.title}</Link></h6>
                                    <span>{convertDate(blog.created_at)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có bài viết nào</p>
                    )
                )}
            </div>
        </div>
    )
}