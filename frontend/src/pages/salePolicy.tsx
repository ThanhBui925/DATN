import { Breadcrumb } from "../components/Breadcrumb";

export const SalesPolicy = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Chính sách bán hàng",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-info-wrapper text-center">
                                <h2>Chính sách bán hàng tại Juta</h2>
                                <p>
                                    Tại Juta, chúng tôi cam kết cung cấp sản phẩm chất lượng và dịch vụ bán hàng chuyên nghiệp, minh bạch để mang lại trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-50">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="Chính sách bán hàng" src="img/about/about1.jpg" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h3>Cam kết bán hàng</h3>
                                <p>
                                    Tất cả sản phẩm tại Juta đều là hàng chính hãng, có nguồn gốc rõ ràng và được bảo hành theo chính sách của nhà sản xuất.
                                </p>
                                <p>
                                    Điều kiện áp dụng chính sách bán hàng:
                                </p>
                                <ul>
                                    <li>Sản phẩm được kiểm tra kỹ lưỡng trước khi giao đến khách hàng.</li>
                                    <li>Thông tin sản phẩm (kích cỡ, màu sắc, chất liệu) được mô tả chi tiết và chính xác trên website.</li>
                                    <li>Hỗ trợ đổi trả trong vòng <strong>7 ngày</strong> nếu sản phẩm bị lỗi hoặc không đúng mô tả.</li>
                                </ul>
                                <p>
                                    Lưu ý: Khách hàng vui lòng kiểm tra sản phẩm ngay khi nhận hàng để đảm bảo quyền lợi.
                                </p>
                                <div className="read-more-btn">
                                    <a href="#">Liên hệ hỗ trợ</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-count-area bg-gray pt-80 pb-50 mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-briefcase-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">100%</h2>
                                    <span>Sản phẩm chính hãng</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-wineglass-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">24/7</h2>
                                    <span>Hỗ trợ khách hàng</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-lightbulb-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">10</h2>
                                    <span>Cửa hàng toàn quốc</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-happy-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">10000</h2>
                                    <span>Khách hàng hài lòng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="About-us-team-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-titel-three text-center">
                                <h2>Quy trình mua sắm</h2>
                                <p>Quy trình mua sắm tại Juta được thiết kế đơn giản, thuận tiện và minh bạch.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 1: Chọn sản phẩm</h3>
                                    <p>Truy cập website hoặc cửa hàng Juta để lựa chọn sản phẩm phù hợp.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 2: Đặt hàng</h3>
                                    <p>Thêm sản phẩm vào giỏ hàng và hoàn tất thanh toán trực tuyến hoặc tại cửa hàng.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 3: Xác nhận đơn hàng</h3>
                                    <p>Juta sẽ xác nhận đơn hàng qua email hoặc tin nhắn trong vòng 24 giờ.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 4: Nhận hàng</h3>
                                    <p>Sản phẩm sẽ được giao đến địa chỉ của bạn hoặc bạn có thể nhận tại cửa hàng.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="testimonials-area">
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-lg-8">
                            <div className="testimonials-active owl-carousel">
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng Juta" src="/img/team/customer-1.png" />
                                    <p>
                                        Mua sắm tại Juta rất tiện lợi, sản phẩm chất lượng và giao hàng nhanh chóng!
                                    </p>
                                    <h4>Nguyễn Minh Tuấn</h4>
                                    <span>Khách hàng thân thiết</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng Juta" src="/img/team/customer-2.png" />
                                    <p>
                                        Tôi rất hài lòng với dịch vụ của Juta, nhân viên tư vấn nhiệt tình và sản phẩm đúng như mô tả!
                                    </p>
                                    <h4>Lê Thị Hồng Nhung</h4>
                                    <span>Khách hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};