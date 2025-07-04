import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const Navbar = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        const path = location.pathname;
        if (path === "/trang-chu") setActiveTab("/trang-chu");
        else if (path === "/bai-viet") setActiveTab("/bai-viet");
        else if (path === "/lien-he") setActiveTab("/lien-he");
        else if (path === "/danh-muc-san-pham") setActiveTab("/danh-muc-san-pham");
        else if (path === "/ve-chung-toi") setActiveTab("/ve-chung-toi");
    }, [location]);

    const handleTabClick = (tab: any) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-8 d-none d-lg-block">
                    <div className="main-menu-area">
                        <nav>
                            <ul>
                                <li className={activeTab === "/trang-chu" ? "active" : ""}>
                                    <Link to="/trang-chu" onClick={() => handleTabClick("/trang-chu")}>Trang chủ</Link>
                                </li>
                                <li className={activeTab === "/danh-muc-san-pham" ? "active" : ""}>
                                    <a href="#">Danh mục sản phẩm<i className="ion-ios-arrow-down"></i></a>
                                    <ul className="mega-menu">
                                        <li><a href="#">Giày thể thao</a>
                                            <ul>
                                                <li><a href="shop.html">Nike</a></li>
                                                <li><a href="shop-right.html">Adidas</a></li>
                                                <li><a href="shop-fullwidth.html">Jordan</a></li>
                                                <li><a href="single-product.html">Mizuno</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="#">Giày sneaker</a>
                                            <ul>
                                                <li><a href="shop.html">Nike</a></li>
                                                <li><a href="shop-right.html">Adidas</a></li>
                                                <li><a href="shop-fullwidth.html">Jordan</a></li>
                                                <li><a href="single-product.html">Mizuno</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="#">Giày thời trang</a>
                                            <ul>
                                                <li><a href="shop.html">Nike</a></li>
                                                <li><a href="shop-right.html">Adidas</a></li>
                                                <li><a href="shop-fullwidth.html">Jordan</a></li>
                                                <li><a href="single-product.html">Mizuno</a></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link to="/danh-muc-san-pham" onClick={() => handleTabClick("/danh-muc-san-pham")}>
                                                Xem tất cả
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className={activeTab === "/ve-chung-toi" ? "active" : ""}>
                                    <a href="#">Giới thiệu<i className="ion-ios-arrow-down"></i></a>
                                    <ul className="mega-menu">
                                        <li><a href="#">Giới thiệu</a>
                                            <ul>
                                                <li>
                                                    <Link to="/ve-chung-toi" onClick={() => handleTabClick("/ve-chung-toi")}>
                                                        Về chúng tôi
                                                    </Link>
                                                </li>
                                                <li><a href="shop-right.html">Thương hiệu đồng hành</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="#">Chính sách</a>
                                            <ul>
                                                <li><a href="blog.html">Chính sách bán hàng</a></li>
                                                <li><a href="blog-right.html">Chính sách hoàn hàng</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="#">Hướng dẫn</a>
                                            <ul>
                                                <li><a href="blog.html">Hưỡng dẫn mua hàng</a></li>
                                                <li><a href="blog-right.html">Hướng dẫn hoàn hàng</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className={activeTab === "/bai-viet" ? "active" : ""}>
                                    <Link to="/bai-viet" onClick={() => handleTabClick("/bai-viet")}>Bài viết</Link>
                                </li>
                                <li className={activeTab === "/lien-he" ? "active" : ""}>
                                    <Link to="/lien-he" onClick={() => handleTabClick("/lien-he")}>Liên hệ</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="social-follow-box">
                        <div className="follow-title">
                            <h2>Theo dõi chúng tôi:</h2>
                        </div>
                        <ul className="social-follow-list">
                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                            <li><a href="#"><i className="fa fa-youtube"></i></a></li>
                            <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                            <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12 d-block d-lg-none">
                    <div className="mobile-menu-area">
                        <div className="mobile-menu">
                            <nav id="mobile-menu-active">
                                <ul>
                                    <li className={activeTab === "/trang-chu" ? "active" : ""}>
                                        <a href="#" onClick={() => handleTabClick("/trang-chu")}>Home</a>
                                        <ul className="dropdown_menu">
                                            <li><a href="index.html">Home Page 1</a></li>
                                            <li><a href="index-2.html">Home Page 2</a></li>
                                            <li><a href="index-3.html">Home Page 3</a></li>
                                            <li><a href="index-4.html">Home Page 4</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#">Features</a>
                                        <ul className="mega-menu">
                                            <li><a href="#">Shop Page</a>
                                                <ul>
                                                    <li><a href="shop.html">Shop Left</a></li>
                                                    <li><a href="shop-right.html">Shop Right</a></li>
                                                    <li><a href="shop-fullwidth.html">Shop Full Width</a></li>
                                                    <li><a href="single-product.html">Single Product</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Blog Page</a>
                                                <ul>
                                                    <li><a href="blog.html">Blog Left</a></li>
                                                    <li><a href="blog-right.html">Blog Right</a></li>
                                                    <li><a href="blog-fullwidth.html">Blog Full Width</a></li>
                                                    <li><a href="blog-details.html">Blog Details</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Pages</a>
                                                <ul>
                                                    <li><a href="my-account.html">My Account</a></li>
                                                    <li><a href="frequently-question.html">FAQ</a></li>
                                                    <li><a href="login-register.html">Login & Register</a></li>
                                                    <li><a href="error404.html">Error 404</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Column</a>
                                                <ul>
                                                    <li><a href="about-us.html">About Us</a></li>
                                                    <li><a href="checkout.html">Checkout</a></li>
                                                    <li><a href="cart.html">Cart Page</a></li>
                                                    <li><a href="wishlist.html">Wish List</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li><a href="#">For women</a>
                                        <ul className="mega-menu mega-menu-2">
                                            <li><a href="#">Jackets</a>
                                                <ul>
                                                    <li><a href="#">Florals</a></li>
                                                    <li><a href="#">Shirts</a></li>
                                                    <li><a href="#">Shorts</a></li>
                                                    <li><a href="#">Stripes</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Jeans</a>
                                                <ul>
                                                    <li><a href="#">Hoodies</a></li>
                                                    <li><a href="#">Sweaters</a></li>
                                                    <li><a href="#">Vests</a></li>
                                                    <li><a href="#">Wedges</a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Men</a>
                                                <ul>
                                                    <li><a href="#">Crochet</a></li>
                                                    <li><a href="#">Dresses</a></li>
                                                    <li><a href="#">Jeans</a></li>
                                                    <li><a href="#">Trousers</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li><a href="shop.html">Shop</a></li>
                                    <li><a href="blog.html">Blog</a></li>
                                    <li><a href="contact.html">Contact</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};