import { Breadcrumb } from "../components/Breadcrumb";

export const CompanionBrand = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Thương hiệu đồng hành",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-info-wrapper text-center">
                                <h2>Thương hiệu đồng hành cùng SportWolk</h2>
                                <p>
                                    SportWolk tự hào hợp tác với các thương hiệu giày dép và thời trang hàng đầu thế giới, mang đến cho khách hàng những sản phẩm chất lượng cao, thiết kế tinh tế và phong cách hiện đại.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-50">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="Thương hiệu đồng hành" src="img/about/about1.jpg" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h3>Về các đối tác của chúng tôi</h3>
                                <p>
                                    SportWolk chỉ hợp tác với các thương hiệu uy tín, đảm bảo sản phẩm chính hãng, chất lượng vượt trội và dịch vụ hậu mãi chuyên nghiệp.
                                </p>
                                <p>
                                    Một số thương hiệu tiêu biểu:
                                </p>
                                <ul>
                                    <li><strong>Nike</strong>: Thương hiệu thể thao hàng đầu với các sản phẩm giày và phụ kiện tiên tiến.</li>
                                    <li><strong>Adidas</strong>: Biểu tượng thời trang thể thao với thiết kế độc đáo và chất lượng cao.</li>
                                    <li><strong>Converse</strong>: Phong cách cổ điển, trẻ trung, phù hợp với mọi lứa tuổi.</li>
                                </ul>
                                <p>
                                    Chúng tôi cam kết mang đến sự đa dạng và chất lượng từ các thương hiệu đồng hành để đáp ứng nhu cầu của khách hàng.
                                </p>
                                <div className="read-more-btn">
                                    <a href="#">Khám phá sản phẩm</a>
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
                                    <h2 className="count">20+</h2>
                                    <span>Thương hiệu toàn cầu</span>
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
                                <h2>Các thương hiệu nổi bật</h2>
                                <p>Chúng tôi tự hào là đối tác chiến lược của những thương hiệu hàng đầu, mang đến sản phẩm chất lượng cho bạn.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Nike</h3>
                                    <p>Cung cấp các dòng giày thể thao và thời trang với công nghệ tiên tiến, phù hợp cho mọi hoạt động.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Adidas</h3>
                                    <p>Kết hợp phong cách và hiệu suất, mang đến sản phẩm thời thượng và bền bỉ.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Converse</h3>
                                    <p>Biểu tượng của phong cách cổ điển, phù hợp với mọi lứa tuổi và phong cách.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Puma</h3>
                                    <p>Thương hiệu năng động với các sản phẩm thời trang và thể thao chất lượng cao.</p>
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
                                    <img alt="Khách hàng SportWolk" src="/img/team/customer-1.png" />
                                    <p>
                                        Sản phẩm từ các thương hiệu tại SportWolk luôn chính hãng và chất lượng, tôi rất hài lòng!
                                    </p>
                                    <h4>Nguyễn Minh Tuấn</h4>
                                    <span>Khách hàng thân thiết</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng SportWolk" src="/img/team/customer-2.png" />
                                    <p>
                                        SportWolk mang đến nhiều lựa chọn từ các thương hiệu lớn, dịch vụ hỗ trợ rất tuyệt vời!
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