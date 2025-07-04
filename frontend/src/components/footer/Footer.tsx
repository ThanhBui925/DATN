export const Footer = () => {
    return (
        <footer className="footer-area"> {/* mt-5 */}
            <div className="footer-top">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <div className="about-us-footer">
                                <div className="footer-logo">
                                    <a href="#"><img src="img/logo/logo_footer.png" alt=""/></a>
                                </div>
                                <div className="footer-info">
                                    <p className="phone">+ (012) 800 456 789</p>
                                    <p className="desc_footer">We are a team of designers and developers that create
                                        high quality Magento, Prestashop, Opencart.</p>
                                    <div className="social_follow">
                                        <ul className="social-follow-list">
                                            <li className="facebook"><a href="#"><i className="fa fa-facebook"></i></a>
                                            </li>
                                            <li className="twitter"><a href="#"><i className="fa fa-twitter"></i></a>
                                            </li>
                                            <li className="youtube"><a href="#"><i className="fa fa-youtube"></i></a>
                                            </li>
                                            <li className="google"><a href="#"><i className="fa fa-google-plus"></i></a>
                                            </li>
                                            <li className="instagram"><a href="#"><i
                                                className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-12">
                            <div className="footer-info-inner">
                                <div className="row">
                                    <div className="col-lg-2 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Products</h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Prices drop </a></li>
                                            <li><a href="#">New products </a></li>
                                            <li><a href="#">Best sales </a></li>
                                            <li><a href="#">Stores</a></li>
                                            <li><a href="#">Login</a></li>
                                            <li><a href="#">My account</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-2 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Our company</h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Delivery</a></li>
                                            <li><a href="#">Legal Notice</a></li>
                                            <li><a href="#">About us</a></li>
                                            <li><a href="#">Contact us </a></li>
                                            <li><a href="#">Sitemap</a></li>
                                            <li><a href="#">Stores</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-2 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Your account </h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Addresses</a></li>
                                            <li><a href="#">Credit slips</a></li>
                                            <li><a href="#">Orders</a></li>
                                            <li><a href="#">Personal info</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-5 offset-xl-1 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Get in touch</h3>
                                        </div>
                                        <div className="block-contact-text">
                                            <p> Juta - Responsive Prestashop Theme<br/>123 Main Street, Anytown, CA
                                                12345 - USA.<br/>United States</p>
                                            <p>Call us: <span>(012) 800 456 789-987 </span></p>
                                            <p>Email us: <span>demo@posthemes.com</span></p>
                                        </div>
                                        <div className="time">
                                            <h3 className="time-title">Opening time</h3>
                                            <div className="time-text">
                                                <p>
                                                    Open: <span>8:00 AM</span> - Close: <span>18:00 PM</span>
                                                    Saturday - Sunday: Close
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="copyright">Copyright &copy; <a href="#">Juta</a>. All Rights Reserved</div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="payment"><img alt="" src="img/icon/payment.png"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}