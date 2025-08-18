import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from "@uiw/react-md-editor";
import { Skeleton } from 'antd';

interface Blog {
    id: number;
    title: string;
    description: string;
    content: string;
    image: string;
    status: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

export const DetailBlog = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/client/blogs/${id}`);
                setBlog(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch blog data');
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    if (loading) return <Skeleton />;
    if (error) return <div>Error: {error}</div>;
    if (!blog) return <div>No blog found</div>;

    return (
        <div className="col-lg-9 order-1 order-lg-2">
            <div className="blog-details mt-95">
                <div className="blog-details-contend mb-60">
                    <h3 className="blog-dtl-header">{blog.title}</h3>
                    <ul className="meta-box meta-blog d-flex">
                        <li className="meta-date">
                            <span><i aria-hidden="true" className="fa fa-calendar"></i>{formatDate(blog.created_at)}</span>
                        </li>
                        <li><i aria-hidden="true" className="fa fa-user"></i>By <a href="#"> Admin</a></li>
                    </ul>
                    <MDEditor.Markdown source={blog.description} />
                    <div className="blog-inner-img">
                        <div className="row align-items-center">
                            <div className="pt-30">
                                <img alt="blog-img" src={`http://127.0.0.1:8000/storage/${blog.image}`} className="full-img" />
                            </div>
                        </div>
                    </div>
                    <div className="blog-betails-bottom mt-30">
                        <MDEditor.Markdown source={blog.content} />
                    </div>
                </div>
            </div>
        </div>
    );
};