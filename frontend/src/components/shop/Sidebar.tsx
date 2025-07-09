import {useEffect, useState} from "react";
import {axiosInstance} from "../../utils/axios";
import {notification, Skeleton} from "antd";

export const Sidebar = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/client/categories')
            if (res.data.status) {
                setCategories(res.data.data);
            } else {
                notification.error({message: res.data.message});
            }
        } catch (e) {
            notification.error({message: (e as Error).message});
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);
    return (
        <div className="col-lg-3 order-2 order-lg-1">
            <div className="sidebar-categores-box">
                <div className="sidebar-title">
                    <h2>Bộ lọc</h2>
                </div>
                <button className="btn-clear-all">Xóa tất cả</button>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo giá</h5>
                    <div className="price-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="radio" name="price-filter"/><a href="#">$10.00 - $11.00
                                    (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$14.00 - $15.00 (2)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$16.00 - $17.00 (2)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$18.00 - $19.00 (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $24.00 - $28.00 (5)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $30.00 - $32.00 (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $50.00 - $53.00 (2) </a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo kích cỡ</h5>
                    <div className="size-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-size"/><a href="#">S (1)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">M (4)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">L (2)</a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo màu sắc</h5>
                    <div className="color-categoriy">
                        <form action="#">
                            <ul>
                                <li><span className="white"></span><a href="#">White (1)</a></li>
                                <li><span className="black"></span><a href="#">Black (1)</a></li>
                                <li><span className="Orange"></span><a href="#">Orange (3) </a></li>
                                <li><span className="Blue"></span><a href="#">Blue (2) </a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo danh mục</h5>
                    <div className="categori-checkbox">
                        <form action="#">
                            <ul>
                                {
                                    loading ? (
                                        <Skeleton />
                                    ) : (
                                        categories && categories.length > 0 ? (
                                            categories.map((category: any) => (
                                                <li key={category.id}><input type="checkbox" name="product-categori"/><a href="#">{ category.name }</a></li>
                                            ))
                                        ) : (
                                            <li>Chưa có danh mục nào !</li>
                                        )
                                    )
                                }
                            </ul>
                        </form>
                    </div>
                </div>
            </div>

            <div className="shop-banner">
                <div className="single-banner">
                    <a href="#"><img src="img/banner/shop-banner.jpg" alt=""/></a>
                </div>
            </div>
        </div>
    )
}