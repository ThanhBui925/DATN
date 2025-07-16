export const Footer = () => {
    return (
        <footer className="footer-area">
            <div className="footer-top">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <div className="about-us-footer">
                                <div className="footer-logo">
                                    <a href="#"><img src="img/logo/logo_footer.png" alt=""/></a>
                                </div>
                                <div className="footer-info">
                                    <p className="phone">012 3456 789</p>
                                    <p className="desc_footer">
                                        Liên hệ chúng tôi khi bạn cần sự hỗ trợ, hay bất cứ thắc mắc nào. Hệ thống hoạt động 24/7,
                                        luôn sẵn sàng phục vụ quý khách hàng !                                    </p>
                                    <div className="social_follow">
                                        <ul className="social-follow-list">
                                            <li className="facebook"><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li className="twitter"><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li className="youtube"><a href="#"><i className="fa fa-youtube"></i></a></li>
                                            <li className="google"><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                            <li className="instagram"><a href="#"><i className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-12">
                            <div className="footer-info-inner">
                                <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Sản phẩm</h3>
                                        </div>
                                        <ul>
                                            <li><a href="#">Giảm giá</a></li>
                                            <li><a href="#">Sản phẩm mới</a></li>
                                            <li><a href="#">Bán chạy nhất</a></li>
                                            <li><a href="#">Cửa hàng</a></li>
                                            <li><a href="#">Đăng nhập</a></li>
                                            <li><a href="#">Tài khoản của tôi</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-4 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Bản đồ</h3>
                                        </div>
                                        <div className={`map`}>
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863806019131!2d105.74468687587265!3d21.038134787455345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1752488530028!5m2!1svi!2s"
                                                width="320"
                                                height="200"
                                                style={{border: 0}}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 offset-xl-1 col-md-6 col-sm-6">
                                        <div className="footer-title">
                                            <h3>Liên hệ</h3>
                                        </div>
                                        <div className="block-contact-text">
                                            <p>
                                                FPT Polytechnic Trịnh Văn Bô, Từ Liêm, Hà Nội.<br/>
                                                Việt Nam
                                            </p>
                                            <p>Gọi chúng tôi: <span>012 3456 789</span></p>
                                            <p>Email chúng tôi: <span>support@juta.com.vn</span></p>
                                        </div>
                                        <div className="time">
                                            <h3 className="time-title">Giờ mở cửa</h3>
                                            <div className="time-text">
                                                <p>
                                                    Mở cửa: <span>8:00 sáng</span> - Đóng cửa: <span>18:00 tối</span><br/>
                                                    Thứ Bảy - Chủ Nhật: Đóng cửa
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
                            <div className="copyright">Bản quyền © <a href="#">Juta</a>. Tất cả quyền được bảo lưu</div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="payment"><img alt="" src="img/icon/payment.png"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};