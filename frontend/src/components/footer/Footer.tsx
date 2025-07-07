import {Link} from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="footer-area"> {/* mt-5 */}
            <div className="footer-top">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <div className="about-us-footer">
                                <div className="footer-logo">
                                    <a href="#"><img src="/img/logo/logo_footer.png" alt=""/></a>
                                </div>
                                <div className="footer-info">
                                    <p className="phone">099 8006 789</p>
                                    <p className="desc_footer">Chúng tôi cam kết sản phẩm của chúng tôi là chính hãng được nhập từ các nhà phân phối lớn nhất toàn cầu.</p>
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
                                            <h3>Sản phẩm</h3>
                                        </div>
                                        <ul>
                                            <li><a href="#sales">Giảm giá</a></li>
                                            <li><a href="#newest">Mới nhất </a></li>
                                            <li><a href="#best_saler">Bán chạy nhất </a></li>
                                            <li><Link to="/danh-muc-san-pham">Shop</Link></li>
                                            <li><Link to="/dang-nhap">Đăng nhập</Link></li>
                                            <li><Link to="/dang-ky">Đăng ký</Link></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-2 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Cửa hàng chúng tôi</h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Giao hàng</a></li>
                                            <li><a href="#">Thông báo</a></li>
                                            <li><a href="#">Về chúng tôi</a></li>
                                            <li><a href="#">Liên hệ</a></li>
                                            <li><a href="#">Bản đồ</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-2 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Tài khoản </h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Địa chỉ</a></li>
                                            <li><a href="#">Thẻ tín dụng</a></li>
                                            <li><a href="#">Đơn hàng</a></li>
                                            <li><a href="#">Thông tin cá nhân</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-5 offset-xl-1 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Thông tin cửa hàng</h3>
                                        </div>
                                        <div className="block-contact-text">
                                            <p> Juta - Luxury shoes shop<br/>68 Đường Cầu Giấy, Hà Nội.<br/>Việt Nam</p>
                                            <p>SĐT: <span>099 8999 999 </span></p>
                                            <p>Email: <span>juta@gmail.com</span></p>
                                        </div>
                                        <div className="time">
                                            <h3 className="time-title">Thời gian mở cửa</h3>
                                            <div className="time-text">
                                                <p>
                                                    Mở: <span>8:00 Sáng</span> - Đóng: <span>20:00 Tối</span><br/>
                                                    Từ Thứ 2-CN hàng tuần
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
                            <div className="payment"><img alt="" src="/img/icon/payment.png"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}