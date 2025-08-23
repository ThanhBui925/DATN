import { Link } from "react-router-dom";
import { convertDate } from "../../helpers/common";

export const SingleBlog = ({ blog }: { blog: any }) => {
    return (
        <div className="blog-wrapper mb-30 main-blog">
            <div className="blog-img mb-20">
                <Link to={`/chi-tiet-bai-viet/${blog.id}`}>
                    <div className="blog-img-container">
                        <img
                            alt={blog.title}
                            src={`http://127.0.0.1:8000/storage/${blog.image}`}
                            className="blog-img"
                            onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image"; // Fallback image
                            }}
                        />
                    </div>
                </Link>
            </div>
            <h3>
                <Link to={`/chi-tiet-bai-viet/${blog.id}`}>{blog.title}</Link>
            </h3>
            <ul className="meta-box">
                <li className="meta-date">
          <span>
            <i aria-hidden="true" className="fa fa-calendar"></i>
              {convertDate(blog.created_at)}
          </span>
                </li>
                <li>
                    <i aria-hidden="true" className="fa fa-user"></i>Tạo bởi <a href="#"> Admin</a>
                </li>
            </ul>
            <p>{blog.description}</p>
            <div className="blog-meta-bundle">
                <div className="blog-readmore">
                    <Link to={`/chi-tiet-bai-viet/${blog.id}`}>
                        Xem thêm <i className="fa fa-angle-double-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};