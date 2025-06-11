import {Link} from "react-router-dom";

export const SingleBlog = () => {
    return (
        <div className="blog-wrapper mb-30 main-blog">
            <div className="blog-img mb-20">
                <Link to={'/chi-tiet-bai-viet/1'}>
                    <img alt="" src="/img/blog/home-1.jpg"/>
                </Link>
            </div>
            <h3><Link to={'/chi-tiet-bai-viet/1'}>Blog took a galley type.</Link></h3>
            <ul className="meta-box">
                <li className="meta-date"><span><i aria-hidden="true" className="fa fa-calendar"></i>dec 21, 2018</span>
                </li>
                <li><i aria-hidden="true" className="fa fa-user"></i>By <a href="#"> Pander</a></li>
            </ul>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas dicta numquam deleniti doloremque illum
                vero, quidem voluptates!</p>
            <div className="blog-meta-bundle">
                <div className="blog-readmore">
                    <Link to={'/chi-tiet-bai-viet/1'}>Read more <i className="fa fa-angle-double-right"></i></Link>
                </div>
            </div>
        </div>
    )
}