import { Breadcrumb } from "../components/Breadcrumb";

export const ReturnOrderInstruct = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Hướng dẫn hoàn hàng",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about-info-wrapper text-center">
                                <h2>Hướng dẫn hoàn hàng tại Juta</h2>
                                <p>
                                    Tại Juta, chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng. Nếu bạn cần hoàn hàng, hãy tham khảo quy trình dưới đây để đảm bảo quá trình diễn ra nhanh chóng và thuận tiện.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-50">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="Hướng dẫn hoàn hàng" src="img/about/about1.jpg" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h3>Chính sách hoàn hàng</h3>
                                <p>
                                    Juta chấp nhận hoàn hàng trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng, với điều kiện sản phẩm chưa qua sử dụng, còn nguyên tem mác, hộp giày và hóa đơn mua hàng.
                                </p>
                                <p>
                                    Các trường hợp được hoàn hàng:
                                </p>
                                <ul>
                                    <li>Sản phẩm bị lỗi do nhà sản xuất (rách, hỏng khóa kéo, bong keo, v.v.).</li>
                                    <li>Sản phẩm không đúng với mô tả hoặc sai kích cỡ/màu sắc đã đặt.</li>
                                    <li>Khách hàng đổi ý (chỉ áp dụng với sản phẩm còn mới 100%).</li>
                                </ul>
                                <p>
                                    Lưu ý: Chi phí vận chuyển hoàn hàng sẽ do khách hàng chi trả, trừ trường hợp lỗi từ phía Juta.
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
                                    <h2 className="count">7</h2>
                                    <span>Ngày hoàn hàng</span>
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
                                <h2>Các bước hoàn hàng</h2>
                                <p>Quy trình hoàn hàng tại Juta được thiết kế để đơn giản và thuận tiện cho bạn.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 1: Liên hệ Juta</h3>
                                    <p>Gửi yêu cầu hoàn hàng qua hotline, email hoặc tại cửa hàng Juta gần nhất.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 2: Đóng gói sản phẩm</h3>
                                    <p>Đóng gói sản phẩm cẩn thận, kèm hóa đơn và tem mác nguyên vẹn.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 3: Gửi sản phẩm</h3>
                                    <p>Gửi sản phẩm về địa chỉ Juta cung cấp hoặc mang trực tiếp đến cửa hàng.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-info">
                                    <h3>Bước 4: Nhận hoàn tiền</h3>
                                    <p>Sau khi kiểm tra, Juta sẽ hoàn tiền hoặc đổi sản phẩm trong vòng 3-5 ngày.</p>
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
                                        Quy trình hoàn hàng của Juta rất nhanh chóng và minh bạch. Tôi đã đổi một đôi giày sai kích cỡ và nhận được sản phẩm mới chỉ sau 3 ngày!
                                    </p>
                                    <h4>Nguyễn Minh Tuấn</h4>
                                    <span>Khách hàng thân thiết</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="Khách hàng Juta" src="/img/team/customer-2.png" />
                                    <p>
                                        Nhân viên Juta hỗ trợ tôi rất nhiệt tình khi tôi cần hoàn hàng. Tôi rất hài lòng với dịch vụ của cửa hàng!
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