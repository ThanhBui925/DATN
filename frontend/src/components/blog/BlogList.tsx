import { SingleBlog } from "./SingleBlog";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Pagination } from "antd";

interface BlogListProps {
    keyword: string;
}

export const BlogList = ({ keyword }: BlogListProps)  => {
    const [loading, setLoading] = useState<boolean>(false);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 9;

    const fetchBlogs = async (page: number) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/client/blogs?page=${page}&limit=${pageSize}&search=${keyword}`
            );
            setBlogs(res.data.data.data ?? []);
            setTotalItems(res.data.total ?? 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage, keyword]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="col-lg-9 order-1 order-lg-2">
            <div className="blog-content-wrap mt-95">
                <div className="row">
                    <div className="col-12">
                        {loading ? (
                            <Skeleton />
                        ) : (
                            (blogs && blogs.length > 0) ? (
                                blogs.map((blog: any) => (
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-4" key={blog.id}>
                                        <SingleBlog blog={blog} />
                                    </div>
                                ))
                            ) : (
                                <h4 className={`text-center`}>Không có bài viết nào</h4>
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 d-flex justify-content-center mt-10">
                    {
                        blogs && blogs.length > 0 && (
                            <Pagination
                                current={currentPage}
                                total={totalItems}
                                pageSize={pageSize}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                style={{ marginTop: "20px" }}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
};