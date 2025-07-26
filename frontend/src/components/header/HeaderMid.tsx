import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useNotify from "../Notification";
import {axiosInstance} from "../../utils/axios";
import {notification, Skeleton} from "antd";
import {convertToInt} from "../../helpers/common";
import emitter from "../../utils/eventBus";

export const HeaderMid = () => {
    const {notify} = useNotify();
    const navigate = useNavigate();
    const [cartData, setCartData] = useState({
        items: [],
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const getCartData = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/cart");
            if (res.data.status) {
                setCartData({
                    items: res.data.data.items,
                    total: res.data.data.total,
                });
            } else {
                notify({message: res.data.message});
            }
        } catch (e: any) {
            notify({message: e.message});
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/categories");
            if (res.data.status) {
                setCategories(res.data.data);
            } else {
                notify({message: res.data.message});
            }
        } catch (e: any) {
            notify({message: e.message});
        } finally {
            setLoading(false);
        }
    };

    const deleteCartData = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/client/cart/items/${id}`);
            notification.success({message: "Sản phẩm đã được xóa khỏi giỏ hàng!"});
        } catch (e: any) {
            notify({message: e.message});
        } finally {
            getCartData();
        }
    };

    const handleSearch = (e: any) => {
        e.preventDefault();
        const query = new URLSearchParams();
        if (searchTerm) query.set("search", searchTerm);
        if (selectedCategory) query.set("category_id", selectedCategory);
        navigate(`/danh-muc-san-pham?${query.toString()}`);
    };

    useEffect(() => {
        getCartData();
        fetchCategories();
        emitter.on("addToCart", getCartData);
        return () => {
            emitter.off("addToCart", getCartData);
        };
    }, []);

    useEffect(() => {
        emitter.emit("loadCategories", categories);
    }, [categories]);

    return (
        <div className="header-mid-area">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 col md-custom-12">
                        <div className="logo logo_header_mid">
                            <Link to="/trang-chu">
                                <img style={{ width: 120, height: 50 }} src="/img/logo/logo.png" alt=""/>
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-9 md-custom-12">
                        <div className="shopping-cart-box">
                            <ul>
                                <li>
                                    <Link to="/gio-hang">
                                        <span className="item-cart-inner">
                                          <span className="item-cont">{cartData.items.length ?? 0}</span>
                                          Giỏ hàng
                                        </span>
                                        <div className="item-total">{convertToInt(cartData.total) + " đ"}</div>
                                    </Link>
                                    <ul className="shopping-cart-wrapper">
                                        {loading ? (
                                            <Skeleton/>
                                        ) : cartData?.items?.length > 0 ? (
                                            <>
                                                {cartData.items.map((cart: any) => (
                                                    <li key={cart.id}>
                                                        <div className="shoping-cart-image">
                                                            <a href="#">
                                                                <img src={cart?.image} style={{height: 100, width: 100}}
                                                                     alt=""/>
                                                                <span
                                                                    className="product-quantity">{cart.quantity}x</span>
                                                            </a>
                                                        </div>
                                                        <div className="shoping-product-details">
                                                            <h3>
                                                                <a href="#">{cart?.product_name}</a>
                                                            </h3>
                                                            <div className="price-box">
                                                                <span className="text-dark">{cart.quantity} x</span>
                                                                <span> {convertToInt(cart.price)} đ</span>
                                                            </div>
                                                            <div className="sizeandcolor">
                                                                <span>{cart.variant?.size}</span>
                                                                <span>{cart.variant?.color}</span>
                                                            </div>
                                                            <div className="remove">
                                                                <button title="Xoá khỏi giỏ hàng"
                                                                        onClick={() => deleteCartData(cart.id)}>
                                                                    <i className="ion-android-delete"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                                <li>
                                                    <div className="d-flex justify-content-between"
                                                         style={{fontSize: 16}}>
                                                        <span className="fw-bold">Tổng tiền sản phẩm:</span>
                                                        <span
                                                            className="text-original-base fw-bold"> {convertToInt(cartData.total)}đ</span>
                                                    </div>
                                                </li>
                                                <li className="shoping-cart-btn">
                                                    <Link className="checkout-btn" to="/gio-hang">
                                                        Xem giỏ hàng
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <p className="mt-3 fs-6">Chưa có sản phẩm nào trong giỏ hàng!</p>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="searchbox">
                            <form onSubmit={handleSearch}>
                                <div className="search-form-input">
                                    <select
                                        id="select"
                                        name="category"
                                        className="nice-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {categories.map((category: any) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Nhập từ khóa sản phẩm ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button className="top-search-btn" type="submit">
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};