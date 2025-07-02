import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { notification, Skeleton } from "antd";
import { Breadcrumb } from "../components/Breadcrumb";
import { convertToInt } from "../helpers/common";
import { axiosInstance } from "../utils/axios";

export const Cart = () => {
    const [cartData, setCartData] = useState({
        items: [],
        total: 0,
    });

    const [loading, setLoading] = useState(true);

    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Giỏ hàng",
    };

    const getCartData = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/cart");
            if (res.data.status) {
                setCartData({
                    items: res.data.data.items,
                    total: res.data.data.total_price,
                });
            } else {
                notification.error({ message: res.data.message });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        } finally {
            setLoading(false);
        }
    };

    const deleteCartData = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/client/cart/items/${id}`);
            notification.success({ description: "Đã xóa sản phẩm khỏi giỏ hàng!", message: "Thành công !" });
            getCartData();
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
    };

    const updateCartQuantity = async (cartItemId: number, variantId: number, quantity: number) => {
        try {
            const res = await axiosInstance.put(`/api/client/cart/items/${cartItemId}`, { variant_id: variantId, quantity });
            if (!res.data.status) {
                notification.error({ message: res.data.message });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
    };

    const handleQuantityChange = (cartId: number, variantId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setCartData((prevCartData) => {
            const updatedItems = prevCartData.items.map((item: any) =>
                item.id === cartId
                    ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
                    : item
            );
            const newTotal = updatedItems.reduce(
                (sum: number, item: any) => sum + item.total,
                0
            );
            return { ...prevCartData, items: updatedItems, total: newTotal };
        });

        updateCartQuantity(cartId, variantId, newQuantity);
    };

    useEffect(() => {
        getCartData();
    }, []);

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {loading ? (
                                <Skeleton active/>
                            ) : cartData.items.length > 0 ? (
                                <form className="cart-table">
                                    <div className="table-content table-responsive">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th className="plantmore-product-remove">Xóa</th>
                                                <th className="plantmore-product-thumbnail">Hình ảnh</th>
                                                <th className="cart-product-name">Sản phẩm</th>
                                                <th className="plantmore-product-price">Đơn giá</th>
                                                <th className="plantmore-product-quantity">Số lượng</th>
                                                <th className="plantmore-product-subtotal">Tổng</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {cartData.items.map((cart: any) => (
                                                <tr key={cart.id}>
                                                    <td className="plantmore-product-remove">
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                deleteCartData(cart.id);
                                                            }}
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </a>
                                                    </td>
                                                    <td className="plantmore-product-thumbnail">
                                                        <a href={`/chi-tiet-san-pham/${cart.product_id}`}>
                                                            <img
                                                                src={cart?.variant?.images[0] || "/img/default.jpg"}
                                                                alt={cart.product_name}
                                                                style={{ height: "150px", width: "200px"}}
                                                            />
                                                        </a>
                                                    </td>
                                                    <td className="plantmore-product-name">
                                                        <a href={`/chi-tiet-san-pham/${cart.product_id}`}>
                                                            {cart.product_name}
                                                        </a>
                                                    </td>
                                                    <td className="plantmore-product-price">
                                                      <span className="amount">
                                                        {convertToInt(cart.price)} vnđ
                                                      </span>
                                                    </td>
                                                    <td className="plantmore-product-quantity">
                                                        <input
                                                            name={`quantity_${cart.id}`}
                                                            value={cart.quantity}
                                                            type="number"
                                                            min="1"
                                                            onChange={(e) =>
                                                                handleQuantityChange(cart.id, cart.variant_id, parseInt(e.target.value) || 1)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="product-subtotal">
                                                          <span className="amount">
                                                            {convertToInt(cart.total)} vnđ
                                                          </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="coupon-all">
                                                <div className="coupon">
                                                    <input
                                                        id="coupon_code"
                                                        className="input-text"
                                                        name="coupon_code"
                                                        placeholder="Mã giảm giá"
                                                        type="text"
                                                    />
                                                    <input
                                                        className="button"
                                                        name="apply_coupon"
                                                        value="Áp dụng mã"
                                                        type="button"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-5 ml-auto">
                                            <div className="cart-page-total">
                                                <h2>Tổng giỏ hàng</h2>
                                                <ul>
                                                    <li>
                                                        Tạm tính <span>{convertToInt(cartData.total)} vnđ</span>
                                                    </li>
                                                    <li>
                                                        Tổng cộng <span>{convertToInt(cartData.total)} vnđ</span>
                                                    </li>
                                                </ul>
                                                <Link to="/thanh-toan">Tiến hành thanh toán</Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <p className="mt-3 fs-6">Chưa có sản phẩm nào trong giỏ hàng!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};