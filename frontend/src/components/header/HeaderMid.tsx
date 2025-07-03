import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import useNotify from "../Notification";
import {axiosInstance} from "../../utils/axios";
import {notification, Skeleton} from "antd";
import {convertToInt} from "../../helpers/common";

export const HeaderMid = () => {

    const { notify } = useNotify();

    const [cartData, setCartData] = useState<{
        items: any[];
        total: number;
    }>({
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);

    const getCartData = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/client/cart')
            if (res.data.status) {
                setCartData({
                    items: res.data.data.items,
                    total: res.data.data.total_price,
                });
            } else {
                notify({message: res.data.message});
            }
        } catch (e) {
            notify({message: (e as Error).message});
        } finally {
            setLoading(false);
        }
    }

    const deleteCartData = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/client/cart/items/${id}`)
            notification.success({ message: "Sản phẩm đã được xóa khỏi giỏ hàng !"})
        } catch (e) {
            notify({message: (e as Error).message});
        } finally {
            getCartData();
        }
    }

    useEffect(() => {
        getCartData();
    }, [])

    return (
        <div className="header-mid-area">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 col md-custom-12">
                        <div className="logo">
                            <Link to="/trang-chu"><img src="/img/logo/logo.png" alt=""/></Link>
                        </div>
                    </div>
                    <div className="col-lg-9 md-custom-12">
                        <div className="shopping-cart-box">
                            <ul>
                                <li>
                                    <Link to="/gio-hang">
                                                <span className="item-cart-inner">
                                                    <span className="item-cont">{ cartData.items.length ?? 0 }</span>
                                                    Giỏ hàng
                                                </span>
                                        <div className="item-total">{ convertToInt(cartData.total) + ' đ' }</div>
                                    </Link>
                                    <ul className="shopping-cart-wrapper">
                                        {
                                            loading ? (
                                                <Skeleton/>
                                            ) : (
                                                cartData?.items?.length > 0 ? (
                                                    <>
                                                        {
                                                            cartData?.items.map((cart: any) => (
                                                                <li>
                                                                    <div className="shoping-cart-image">
                                                                        <a href="#">
                                                                            <img src={cart?.variant?.images[0]} style={{ height: 100, width: 100}} alt=""/>
                                                                            <span className="product-quantity">{cart.quantity}x</span>
                                                                        </a>
                                                                    </div>
                                                                    <div className="shoping-product-details">
                                                                        <h3><a href="#">{cart?.product_name}</a></h3>
                                                                        <div className="price-box">
                                                                            <span className={`text-dark`}>{cart.quantity} x</span><span> {convertToInt(cart.price)} đ</span>
                                                                        </div>
                                                                        <div className="sizeandcolor">
                                                                            <span>{cart.variant?.size}</span>
                                                                            <span>{cart.variant?.color}</span>
                                                                        </div>
                                                                        <div className="remove">
                                                                            <button title="Xoá khỏi giỏ hàng" onClick={() => deleteCartData(cart.id)}><i
                                                                                className="ion-android-delete"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        }
                                                        <li>
                                                            <div className="d-flex justify-content-between" style={{ fontSize: 16}}>
                                                                <span className={`fw-bold`}>Tổng tiền sản phẩm:</span>
                                                                <span className="text-original-base fw-bold"> {convertToInt(cartData.total)}đ</span>
                                                            </div>
                                                        </li>
                                                        <li className="shoping-cart-btn">
                                                            <Link className="checkout-btn" to="/gio-hang">Xem giỏ hàng</Link>
                                                        </li>
                                                    </>
                                                ) : (
                                                    <p className={`mt-3 fs-6`}>Chưa có sản phẩm nào trong giỏ hàng !</p>
                                                )
                                            )
                                        }
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="searchbox">
                            <form action="#">
                                <div className="search-form-input">
                                    <select id="select" name="select" className="nice-select">
                                        <option value="">Tất cả danh mục</option>
                                        <option value="12">Uncategorized</option>
                                        <option value="22">Electronics</option>
                                        <option value="26">Accessories</option>
                                        <option value="27">Cap HDMI</option>
                                        <option value="28">Headphone</option>
                                        <option value="29">Keyboard</option>
                                        <option value="23">Mouse</option>
                                        <option value="30">Laptops & Tablets</option>
                                        <option value="31">Laptop</option>
                                        <option value="31">Macbook</option>
                                        <option value="31">Smartphone</option>
                                        <option value="31">Tablets</option>
                                        <option value="32">Tvs & Audios</option>
                                        <option value="33">Amply</option>
                                        <option value="24">Smart TV</option>
                                        <option value="34">Speaker</option>
                                        <option value="35">TV</option>
                                        <option value="36">Fashion & Jewelry</option>
                                        <option value="37">Accessories</option>
                                        <option value="25">Rings</option>
                                        <option value="38">Watches</option>
                                    </select>
                                    <input type="text" placeholder="Nhập từ khóa sản phẩm ... "/>
                                    <button className="top-search-btn" type="submit">Tìm kiếm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}