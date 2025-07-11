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

const mockApi: Banner[] = [
    {
        id: 1,
        title: "Summer Sale",
        description: "Enjoy up to 50% off on selected items.",
        image_url: "https://thietke6d.com/wp-content/uploads/2021/05/banner-quang-cao-giay-3.webp",
        link_url: "https://example.com/sale"
    },
    {
        id: 2,
        title: "New Arrivals",
        description: "Check out the latest products in our collection.",
        image_url: "https://thietke6d.com/wp-content/uploads/2021/05/banner-quang-cao-giay-4.webp",
        link_url: "https://example.com/new"
    },
    {
        id: 3,
        title: "Free Shipping",
        description: "Free shipping on orders over $100.",
        image_url: "https://thietke6d.com/wp-content/uploads/2021/05/banner-quang-cao-giay-6.webp",
        link_url: "https://example.com/shipping-info"
    },
];

export const SliderBanner: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/client/banners`);
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
                    mockApi.map((banner: Banner) => (
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
                )}
            </Slider>
        </div>
    );
};