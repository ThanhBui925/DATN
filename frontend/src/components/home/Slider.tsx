import axios from "axios";
import { useEffect, useState } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/banners");
        setBanners(response.data.data.filter((b: Banner) => b.status === "1"));
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };
    fetchBanner();
  }, []);

  // Auto slide
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [banners]);

  const fixImageUrl = (url: string) => url.replace('127.0.0.1', 'localhost');

  if (banners.length === 0) return null;

  const item = banners[currentIndex];

  return (
    <div className="slider-main-area">
      <div
        className="slider-wrapper"
        style={{
          backgroundImage: `url(${fixImageUrl(item.image_url)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: 500,
          transition: "background-image 0.8s ease-in-out",
        //   border: "2px solid red",
        }}
      >
        <div className="container-fluid">
          <div className="row justify-content-end">
            <div className="col-lg-11 col-md-11">
              <div className="slider-text-info style-1 slider-text-animation">
                <h4 className="title1">{item.title}</h4>
                <h1 className="title2">
                  <span>Product</span> New
                </h1>
                <p>History Month Collection 2018</p>
                <div className="slier-btn-1">
                  <a
                    title="shop now"
                    href={item.link_url}
                    className="shop-btn"
                  >
                    Shopping now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};
