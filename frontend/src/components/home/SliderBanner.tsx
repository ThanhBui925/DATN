import React, {useEffect, useState} from "react";
import {notification} from "antd";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Banner {
    id: number;
    title?: string;
    description?: string;
    image_url?: string;
    link_url?: string;
}

export const SliderBanner: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/banners`);
            setBanners(res.data.data || []);
        } catch (e) {
            console.error(e);
            notification.error({message: (e as Error).message});
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        fade: false,
    };

    return (
        <div className="slider-main-area">
            <Slider {...settings}>
                {banners.length > 0 ? (
                    banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="slider-wrapper"
                        >
                            <div className="container-fluid"
                                 style={{
                                     backgroundImage: `url(${banner.image_url || "/img/slider/home-1-01.jpg"})`,
                                     backgroundSize: "cover",
                                     backgroundPosition: "center",
                                     backgroundRepeat: "no-repeat",
                                     height: "500px",
                                     width: "100%",
                                 }}>
                                <div className="row justify-content-end">
                                    <div className="col-lg-11 col-md-11">
                                        <div className="slider-text-info style-1 slider-text-animation">
                                            <h4 className="title1">
                                                {banner.description || "Khuyến mãi đặc biệt"}
                                            </h4>
                                            <h1 className="title2">{banner.title}</h1>
                                            <div className="slier-btn-1" style={{ marginTop: "20px" }}>
                                                <a
                                                    title="Mua sắm ngay"
                                                    href={banner.link_url || "#"}
                                                    className="shop-btn"
                                                >
                                                    Mua sắm ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div
                            className="slider-wrapper"
                            style={{
                                backgroundImage: "url(/img/slider/home-1-01.jpg)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="container-fluid">
                                <div className="row justify-content-end">
                                    <div className="col-lg-11 col-md-11">
                                        <div className="slider-text-info style-1 slider-text-animation">
                                            <h4 className="title1">Khuyến mãi lên đến 20%</h4>
                                            <h1 className="title2">
                                                <span>Nike</span> Black
                                            </h1>
                                            <p>Bộ sưu tập tháng lịch sử 2018</p>
                                            <div className="slier-btn-1">
                                                <a title="Mua sắm ngay" href="#" className="shop-btn">
                                                    Mua sắm ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="slider-wrapper"
                            style={{
                                backgroundImage: "url(/img/slider/home-1-02.jpg)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="container-fluid">
                                <div className="row justify-content-end">
                                    <div className="col-lg-11 col-md-11">
                                        <div className="slider-text-info style-1 slider-text-animation">
                                            <h4 className="title1">Sản phẩm nổi bật 2018</h4>
                                            <h1 className="title2">
                                                <span>Mới</span> Lookbook
                                            </h1>
                                            <p>Cửa hàng Juta | Quần áo & Thiết bị thể thao</p>
                                            <div className="slier-btn-1">
                                                <a title="Mua sắm ngay" href="#" className="shop-btn">
                                                    Mua sắm ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="slider-wrapper"
                            style={{
                                backgroundImage: "url(/img/slider/home-1-03.jpg)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="container-fluid">
                                <div className="row justify-content-end">
                                    <div className="col-lg-11 col-md-11">
                                        <div className="slider-text-info style-1 slider-text-animation">
                                            <h4 className="title1">Áo khoác hàng đầu của Juta</h4>
                                            <h1 className="title2">
                                                <span>Mới</span> Áo khoác
                                            </h1>
                                            <p>Áo khoác Aurora Shell sẵn sàng cho mọi cuộc phiêu lưu.</p>
                                            <div className="slier-btn-1">
                                                <a title="Mua sắm ngay" href="#" className="shop-btn">
                                                    Mua sắm ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Slider>
        </div>
    );
};