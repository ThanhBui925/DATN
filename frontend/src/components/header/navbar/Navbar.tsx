export const Navbar = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-8 d-none d-lg-block">
                    <div className="main-menu-area">
                        <nav>
                            <ul>
                                <li className="active"><a href="index.html">Home <i
                                    className="ion-ios-arrow-down"></i></a>
                                    <ul className="dropdown_menu">
                                        <li><a href="index.html">Home Page 1</a></li>
                                        <li><a href="index-2.html">Home Page 2</a></li>
                                        <li><a href="index-3.html">Home Page 3</a></li>
                                        <li><a href="index-4.html">Home Page 4</a></li>
                                    </ul>
                                </li>
                                <li><a href="#">Features<i className="ion-ios-arrow-down"></i></a>
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
                                <li><a href="shop.html">For women <i className="ion-ios-arrow-down"></i></a>
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
                <div className="col-lg-4">
                    <div className="social-follow-box">
                        <div className="follow-title">
                            <h2>Follow us:</h2>
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
                                    <li className="active"><a href="#">Home</a>
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
    )
}