import {Breadcrumb} from "../../components/Breadcrumb";

export const AboutUsPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Về SportWolk",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="" src="img/about/about1.jpg"/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h2>Về SportWolk</h2>
                                <p>
                                    SportWolk là thương hiệu giày thời trang hàng đầu, mang đến những sản phẩm chất lượng
                                    cao, thiết kế hiện đại và phong cách độc đáo. Chúng tôi tự hào cung cấp những đôi
                                    giày phù hợp với mọi cá tính, từ năng động đến thanh lịch.
                                </p>
                                <p>
                                    Thành lập từ năm 2015, SportWolk không ngừng cải tiến để đáp ứng nhu cầu của khách hàng.
                                    Mỗi sản phẩm đều được chế tác tỉ mỉ, đảm bảo sự thoải mái và bền bỉ, giúp bạn tự tin
                                    trong từng bước đi.
                                </p>
                                <p>
                                    Với sứ mệnh mang lại giá trị tốt nhất, SportWolk cam kết đồng hành cùng bạn trên hành
                                    trình định hình phong cách riêng.
                                </p>
                                <div className="btn bg-original-base">
                                    <a className={`text-light`} href="#">Tìm hiểu thêm</a>
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
                                    <h2 className="count">5000</h2>
                                    <span>Sản phẩm đã bán</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-wineglass-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">200</h2>
                                    <span>Mẫu giày độc quyền</span>
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
                            <div className="section-titel-three">
                                <h2>Đội ngũ SportWolk</h2>
                                <p>Đội ngũ tận tâm của chúng tôi luôn nỗ lực mang đến những sản phẩm và dịch vụ tốt nhất
                                    cho khách hàng.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Nguyễn Văn An" src="img/about/team-1.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Bùi Trung Thành</h3>
                                    <p>CEO</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Trần Thị Mai" src="img/about/team-2.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Trang Phạm</h3>
                                    <p>Quản lý thương hiệu</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Lê Minh Hoàng" src="img/about/team-3.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Nguyễn Quang Quyền</h3>
                                    <p>Chuyên viên marketing</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Phạm Ngọc Linh" src="img/about/team-4.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Trọng Nguyễn</h3>
                                    <p>Chăm sóc khách hàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Phạm Ngọc Linh" src="img/about/team-4.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Quách Xuân Việt</h3>
                                    <p>Chăm sóc khách hàng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Phạm Ngọc Linh" src="img/about/team-4.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Đào Ngọc Hào</h3>
                                    <p>Chăm sóc khách hàng</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="Phạm Ngọc Linh" src="img/about/team-4.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li>
                                                <a className="facebook" href="#">
                                                    <i className="fa fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="twitter" href="#">
                                                    <i className="fa fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="vimeo" href="#">
                                                    <i className="fa fa-vimeo"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="instagram" href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Phạm Quang Đế</h3>
                                    <p>Chăm sóc khách hàng</p>
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
                                    <img alt="Khách hàng SportWolk" src="/img/team/customer-1.png"/>
                                    <p>
                                        Sản phẩm của SportWolk thực sự tuyệt vời! Tôi đã mua một đôi giày thể thao và rất hài
                                        lòng với chất lượng cũng như sự thoải mái. Dịch vụ khách hàng cũng rất chuyên
                                        nghiệp.
                                    </p>
                                    <h4>Nguyễn Thu Hà</h4>
                                    <span>Khách hàng thân thiết</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng SportWolk" src="/img/team/customer-2.png"/>
                                    <p>
                                        SportWolk mang đến những thiết kế độc đáo, giúp tôi tự tin hơn khi diện chúng. Tôi sẽ
                                        tiếp tục ủng hộ thương hiệu này trong tương lai!
                                    </p>
                                    <h4>Trần Quốc Anh</h4>
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