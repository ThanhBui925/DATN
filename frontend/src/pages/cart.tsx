import { Link } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import { notification, Skeleton, Select } from "antd";
import { convertToInt } from "../helpers/common";
import { axiosInstance } from "../utils/axios";
import {debounce} from "lodash";

export const Cart = () => {
    const [cartData, setCartData] = useState({
        items: [],
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
    const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
    const [errorQty, setErrorQty] = useState<{ [key: number]: string }>({});

    const getCartData = async () => {
        // setLoading(true);
        try {
            const res = await axiosInstance.get("/api/client/cart");
            if (res.data.status) {
                const items = res.data.data.items.map((item: any) => {
                    setSelectedSizes((prev) => ({ ...prev, [item.id]: item.size }));
                    setSelectedColors((prev) => ({ ...prev, [item.id]: item.color }));
                    return item;
                });
                setCartData({
                    items,
                    total: res.data.data.total,
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

    const updateCartQuantity = async (cartItemId: number, variantId: number, quantity: number) => {
        try {
            const res = await axiosInstance.put(`/api/client/cart/items/${cartItemId}`, {
                variant_id: variantId,
                quantity,
            });
            if (!res.data.status) {
                notification.error({ message: res.data.message });
            } else {
                notification.success({ message: "Cập nhật giỏ hàng thành công" });
            }
        } catch (e) {
            notification.error({ message: "Cập nhật giỏ hàng thất bại" + (e as Error).message });
        } finally {
            getCartData();
        }
    };

    const debouncedUpdateCartQuantity = useCallback(
        debounce((cartItemId: number, variantId: number, quantity: number) => {
            updateCartQuantity(cartItemId, variantId, quantity);
        }, 1000),
        []
    );

    const handleQuantityChange = (cartId: number, variantId: number, newQuantity: number) => {
        const cartItem = cartData.items.find((item: any) => item.id === cartId) as any;
        if (newQuantity < 1) return;

        const variant = cartItem.available_variants.find((v: any) => v.id === variantId);
        if (newQuantity > (variant?.quantity || 0)) {
            setErrorQty((prev) => ({ ...prev, [cartId]: `Chỉ còn ${variant?.quantity} sản phẩm` }));
            return;
        }

        setErrorQty((prev) => ({ ...prev, [cartId]: '' }));

        setCartData((prevCartData: any) => {
            const updatedItems = prevCartData.items.map((item: any) =>
                item.id === cartId
                    ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
                    : item
            );
            const newTotal = updatedItems.reduce((sum: number, item: any) => sum + item.total, 0);
            return { ...prevCartData, items: updatedItems, total: newTotal };
        });

        debouncedUpdateCartQuantity(cartId, variantId, newQuantity);
    };

    const handleSizeChange = (cartId: number, newSizeId: string) => {
        const cartItem = cartData.items.find((item: any) => item.id === cartId) as any;
        const availableVariants = cartItem.available_variants;
        const newVariant = availableVariants.find((v: any) => v.size === newSizeId && v.color === selectedColors[cartId]);
        const variantId = newVariant ? newVariant.id : cartItem.variant_id;

        setSelectedSizes((prev) => ({ ...prev, [cartId]: newSizeId }));
        updateVariant(cartId, variantId);
    };

    const handleColorChange = (cartId: number, newColorId: string) => {
        const cartItem = cartData.items.find((item: any) => item.id === cartId) as any;
        const availableVariants = cartItem.available_variants;
        const newVariant = availableVariants.find((v: any) => v.color === newColorId && v.size === selectedSizes[cartId]);
        const variantId = newVariant ? newVariant.id : cartItem.variant_id;

        setSelectedColors((prev) => ({ ...prev, [cartId]: newColorId }));
        updateVariant(cartId, variantId);
    };

    const updateVariant = async (cartId: number, variantId: number) => {
        const cartItem = cartData.items.find((item: any) => item.id === cartId) as any;
        await updateCartQuantity(cartId, variantId, cartItem.quantity);
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

    useEffect(() => {
        getCartData();
    }, []);

    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex gap-4">
                                <a className={`d-sm-block d-none`} href="/trang-chu">
                                    <img className={`mt-2`} src="/img/logo/logo.png" alt="" />
                                </a>
                                <h1 className="cE_Tbx text-original-base">Giỏ hàng</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-wraper mt-95 mb-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {loading ? (
                                <Skeleton active />
                            ) : cartData.items.length > 0 ? (
                                <form className="cart-table">
                                    <div className="table-content table-responsive">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th className="plantmore-product-remove">Xóa</th>
                                                <th className="plantmore-product-thumbnail">Hình ảnh</th>
                                                <th className="cart-product-name">Sản phẩm</th>
                                                <th className="plantmore-product-size">Kích cỡ</th>
                                                <th className="plantmore-product-color">Màu</th>
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
                                                                src={cart.image || "/img/default.jpg"}
                                                                alt={cart.product_name}
                                                                style={{ height: "150px", width: "200px" }}
                                                            />
                                                        </a>
                                                    </td>
                                                    <td className="plantmore-product-name">
                                                        <a href={`/chi-tiet-san-pham/${cart.product_id}`}>
                                                            {cart.product_name}
                                                        </a>
                                                    </td>
                                                    <td className="plantmore-product-size">
                                                        <Select
                                                            value={selectedSizes[cart.id] || cart.size}
                                                            onChange={(value) => handleSizeChange(cart.id, value)}
                                                            style={{ width: 100 }}
                                                        >
                                                            {cart.available_variants
                                                                .map((v: any) => v.size)
                                                                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
                                                                .map((size: string) => (
                                                                    <Select.Option key={size} value={size}>
                                                                        {size}
                                                                    </Select.Option>
                                                                ))}
                                                        </Select>
                                                    </td>
                                                    <td className="plantmore-product-color">
                                                        <Select
                                                            value={selectedColors[cart.id] || cart.color}
                                                            onChange={(value) => handleColorChange(cart.id, value)}
                                                            style={{ width: 100 }}
                                                        >
                                                            {cart.available_variants
                                                                .map((v: any) => v.color)
                                                                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
                                                                .map((color: string) => (
                                                                    <Select.Option key={color} value={color}>
                                                                        {color}
                                                                    </Select.Option>
                                                                ))}
                                                        </Select>
                                                    </td>
                                                    <td className="plantmore-product-price">
                                                        <span className="amount">{convertToInt(cart.price)} vnđ</span>
                                                    </td>
                                                    <td className="plantmore-product-quantity d-flex justify-content-center flex-column align-items-center">
                                                        <div className="input-group" style={{ width: "150px" }}>
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => handleQuantityChange(cart.id, cart.variant_id, cart.quantity - 1)}
                                                                disabled={cart.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="form-control text-center"
                                                                value={cart.quantity}
                                                                onChange={(e) => {
                                                                    const value = parseInt(e.target.value) || 1;
                                                                    handleQuantityChange(cart.id, cart.variant_id, value);
                                                                }}
                                                                min="1"
                                                            />
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => handleQuantityChange(cart.id, cart.variant_id, cart.quantity + 1)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        {errorQty[cart.id] && <div className="text-danger mt-1">{errorQty[cart.id]}</div>}
                                                    </td>
                                                    <td className="product-subtotal">
                                                        <span className="amount">{convertToInt(cart.total)} vnđ</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
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