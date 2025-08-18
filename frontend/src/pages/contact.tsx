import { Breadcrumb } from "../components/Breadcrumb";
import axios from "axios";
import {notification} from "antd";

export const ContactPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Liên hệ",
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = {
            name: e.target.name.value,
            lastname: e.target.lastname.value,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
        };

        try {
            await axios.post(import.meta.env.VITE_APP_API_URL + '/api/contact', formData);
            notification.success({message: "Gửi liên hệ thành công !"})
            e.target.reset();
        } catch (error: any) {
            notification.error({ message: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại." });
        }
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper my-5">
                <div className="container-fluid p-0">
                    <div className="row no-gutters px-5">
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12">
                            <div className="contact-form-inner" style={{ padding: "0 50px" }}>
                                <h2>HÃY NÓI CHÚNG TÔI VỀ DỰ ÁN CỦA BẠN</h2>
                                <form id="contact-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="Tên*" name="name" required />
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="Họ*" name="lastname" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6">
                                            <input type="email" placeholder="Email*" name="email" required />
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="Chủ đề*" name="subject" required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <textarea placeholder="Tin nhắn*" name="message" required></textarea>
                                        </div>
                                    </div>
                                    <div className="contact-submit-btn">
                                        <button className="submit-btn" type="submit">Gửi Liên Hệ</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12 plr-0">
                            <div className="contact-address-area" style={{ padding: 50 }}>
                                <h2>LIÊN HỆ VỚI CHÚNG TÔI</h2>
                                <p>
                                    Liên hệ chúng tôi khi bạn cần sự hỗ trợ, hay bất cứ thắc mắc nào. Hệ thống hoạt động 24/7,
                                    luôn sẵn sàng phục vụ quý khách hàng !
                                </p>
                                <ul>
                                    <li>
                                        <i className="fa fa-fax"> </i> Địa chỉ: FPT Polytechnic Trịnh Văn Bô, Từ Liêm, Hà Nội
                                    </li>
                                    <li>
                                        <i className="fa fa-phone"> </i> support@SportWolk.com.vn
                                    </li>
                                    <li>
                                        <i className="fa fa-envelope-o"></i> 012 3456 789
                                    </li>
                                </ul>
                                <h3>Giờ làm việc</h3>
                                <p className="m-0">
                                    <strong>Thứ Hai – Chủ Nhật</strong>: 08:00 – 22:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};