import { Breadcrumb } from "../components/Breadcrumb";

export const OrderInstruct = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Hướng dẫn mua hàng",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-info-wrapper text-center">
                                <h2>Hướng dẫn mua hàng tại Juta</h2>
                                <p>
                                    Tại Juta, chúng tôi mang đến quy trình mua sắm đơn giản, nhanh chóng và minh bạch để đảm bảo trải nghiệm tuyệt vời nhất cho khách hàng. Hãy tham khảo hướng dẫn dưới đây để bắt đầu mua sắm!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-50">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="Hướng dẫn mua hàng" src="img/about/about1.jpg" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h3>Cách thức mua hàng</h3>
                                <p>
                                    Juta cung cấp hai hình thức mua sắm: trực tuyến qua website và trực tiếp tại các cửa hàng trên toàn quốc.
                                </p>
                                <p>
                                    Các bước mua hàng trực tuyến:
                                </p>
                                <ul>
                                    <li>Truy cập website Juta, chọn sản phẩm và thêm vào giỏ hàng.</li>
                                    <li>Điền thông tin giao hàng và thanh toán.</li>
                                    <li>Xác nhận đơn hàng và chờ giao hàng trong vòng 2-5 ngày.</li>
                                </ul>
                                <p>
                                    Lưu ý: Khách hàng vui lòng kiểm tra kỹ thông tin sản phẩm (kích cỡ, màu sắc) trước khi đặt hàng.
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
                                    <h2 className="count">2-5</h2>
                                    <span>Ngày giao hàng</span>
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
                                <h2>Các bước mua hàng trực tuyến</h2>
                                <p>Quy trình mua hàng tại Juta được thiết kế để đơn giản và thuận tiện cho bạn.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 1: Chọn sản phẩm</h3>
                                    <p>Truy cập website Juta, tìm và chọn sản phẩm phù hợp.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 2: Thêm vào giỏ hàng</h3>
                                    <p>Chọn kích cỡ, màu sắc và thêm sản phẩm vào giỏ hàng.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 3: Thanh toán</h3>
                                    <p>Điền thông tin giao hàng và chọn phương thức thanh toán.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 4: Nhận hàng</h3>
                                    <p>Nhận sản phẩm tại địa chỉ đã cung cấp hoặc tại cửa hàng Juta.</p>
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
                                        Mua sắm tại Juta rất dễ dàng, website thân thiện và giao hàng đúng hẹn!
                                    </p>
                                    <h4>Nguyễn Minh Tuấn</h4>
                                    <span>Khách hàng thân thiết</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng Juta" src="/img/team/customer-2.png" />
                                    <p>
                                        Tôi rất hài lòng với quy trình mua hàng tại Juta, nhân viên hỗ trợ rất nhiệt tình!
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