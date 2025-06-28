import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick"; // ✅ Bắt buộc

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Banner {
    id: number;
    title: string;
    image_url: string;
    description: string;
    link_url: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export const SliderBanner = () => {
    const [banners, setBanners] = useState<Banner[]>([]);

    useEffect(() => {
        const fetchBanner = async () => {
            const response = await axios.get("http://localhost:8000/api/banners");
            setBanners(response.data.data.filter((b: Banner) => b.status === "1"));
        };
        fetchBanner();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: true,
    };

    return (
        <div className="slider-main-area">
            <Slider {...settings}>
                {banners.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            backgroundImage: `url(${item.image_url})`, // Gợi ý: dùng ảnh từ API
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: 500,
                        }}
                    >
                        <div className="container-fluid">
                            <div className="row justify-content-end">
                                <div className="col-lg-11 col-md-11">
                                    <div className="slider-text-info style-1 slider-text-animation">
                                        <h4 className="title1">{item.title}</h4>
                                        <h1 className="title2">
                                            <span>nike</span> Black
                                        </h1>
                                        <p>History Month Collection 2018</p>
                                        <div className="slier-btn-1">
                                            <a title="shop now" href={item.link_url} className="shop-btn">
                                                Shopping now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};
