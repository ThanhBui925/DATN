import {Link, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {notification, Skeleton, Modal} from "antd";
import {convertToInt} from "../helpers/common";
import {axiosInstance} from "../utils/axios";
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
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate();

    // Modal states
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [currentCartId, setCurrentCartId] = useState<number | null>(null);
    const [tempColor, setTempColor] = useState('');
    const [tempSize, setTempSize] = useState('');
    const [tempVariant, setTempVariant] = useState<any>(null);
    const [tempImage, setTempImage] = useState('');
    const [availableStock, setAvailableStock] = useState<number>(0);

    const getCartData = async () => {
        try {
            const res = await axiosInstance.get("/api/client/cart");
            if (res.data.status) {
                const items = res.data.data.items.map((item: any) => {
                    setSelectedSizes((prev) => ({...prev, [item.id]: item.size}));
                    setSelectedColors((prev) => ({...prev, [item.id]: item.color}));
                    setSelectedItems((prev) => ({...prev, [item.id]: true})); // Default select all
                    return item;
                });
                setCartData({
                    items,
                    total: res.data.data.total,
                });
            } else {
                notification.error({message: res.data.message});
            }
        } catch (e) {
            notification.error({message: (e as Error).message});
        } finally {
            setLoading(false);
        }
    };

    const getExistingQty = (variantId: number, excludeCartId?: number) => {
        return cartData.items.reduce((sum: number, item: any) => {
            if (item.variant_id === variantId && item.id !== excludeCartId) {
                return sum + item.quantity;
            }
            return sum;
        }, 0);
    };

    const updateCartQuantity = async (cartItemId: number, variantId: number, quantity: number) => {
        try {
            const res = await axiosInstance.put(`/api/client/cart/items/${cartItemId}`, {
                variant_id: variantId,
                quantity,
            });
            if (!res.data.status) {
                notification.error({message: res.data.message});
            } else {
                notification.success({message: "Cập nhật giỏ hàng thành công"});
            }
        } catch (e) {
            notification.error({message: "Cập nhật giỏ hàng thất bại" + (e as Error).message});
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
        const existingQty = getExistingQty(variantId, cartId);
        const maxQty = variant?.quantity - existingQty || 0;

        if (newQuantity > maxQty) {
            setErrorQty((prev) => ({...prev, [cartId]: `Chỉ còn ${maxQty} sản phẩm`}));
            return;
        }

        setErrorQty((prev) => ({...prev, [cartId]: ''}));

        setCartData((prevCartData: any) => {
            const updatedItems = prevCartData.items.map((item: any) =>
                item.id === cartId
                    ? {...item, quantity: newQuantity, total: item.price * newQuantity}
                    : item
            );
            const newTotal = updatedItems
                .filter((item: any) => selectedItems[item.id])
                .reduce((sum: number, item: any) => sum + item.total, 0);
            return {...prevCartData, items: updatedItems, total: newTotal};
        });

        debouncedUpdateCartQuantity(cartId, variantId, newQuantity);
    };

    const deleteCartData = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/client/cart/items/${id}`);
            notification.success({description: "Đã xóa sản phẩm khỏi giỏ hàng!", message: "Thành công !"});
            setSelectedItems((prev) => {
                const newSelected = {...prev};
                delete newSelected[id];
                return newSelected;
            });
            getCartData();
        } catch (e) {
            notification.error({message: (e as Error).message});
        }
    };

    const handleCheckboxChange = (cartId: number) => {
        setSelectedItems((prev) => {
            const newSelected = {...prev, [cartId]: !prev[cartId]};
            const newTotal = cartData.items
                .filter((item: any) => newSelected[item.id])
                .reduce((sum: number, item: any) => sum + item.total, 0);
            setCartData((prevCartData: any) => ({...prevCartData, total: newTotal}));
            return newSelected;
        });
    };

    const handleSubmit = async () => {
        const selectedCartIds = Object.keys(selectedItems)
            .filter((key) => selectedItems[parseInt(key)])
            .map((key) => parseInt(key));

        if (selectedCartIds.length === 0) {
            notification.error({message: "Vui lòng chọn ít nhất một sản phẩm để thanh toán!"});
            return;
        }

        sessionStorage.setItem("cartItemsId", JSON.stringify(selectedCartIds));
        navigate('/thanh-toan');
    };

    const openVariantModal = (cartId: number) => {
        const item = cartData.items.find((i: any) => i.id === cartId);
        if (item) {
            setCurrentCartId(cartId);
            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/*@ts-ignore*/}
            setTempColor(item.color);
            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/*@ts-ignore*/}
            setTempSize(item.size);
            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/*@ts-ignore*/}
            const variant = item.available_variants.find((v: any) => v.size === item.size && v.color === item.color);
            const existingQty = getExistingQty(variant?.id, cartId);
            const avail = variant?.quantity - existingQty || 0;
            setAvailableStock(avail);
            setTempVariant(variant);
            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/*@ts-ignore*/}
            setTempImage(variant?.images[0]?.image_url || item.image);
            setShowVariantModal(true);
        }
    };

    const handleConfirmVariant = async () => {
        if (!tempVariant) {
            notification.error({message: 'Vui lòng chọn đầy đủ biến thể'});
            return;
        }
        const item = cartData.items.find((i: any) => i.id === currentCartId) as any;
        let qty = item.quantity;
        if (qty > availableStock) {
            qty = availableStock;
            notification.warning({message: `Số lượng vượt quá tồn kho, điều chỉnh xuống ${qty}`});
        }
        await updateCartQuantity(currentCartId as number, tempVariant.id, qty);
        setShowVariantModal(false);
    };

    useEffect(() => {
        setLoading(true)
        getCartData();
    }, []);

    useEffect(() => {
        if (tempVariant && currentCartId) {
            const existingQty = getExistingQty(tempVariant.id, currentCartId);
            setAvailableStock(tempVariant.quantity - existingQty);
        }
    }, [tempVariant, currentCartId, cartData]);

    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex gap-4">
                                <a className={`d-sm-block d-none`} href="/trang-chu">
                                    <img className={`mt-2`} style={{height: 50}} src="/img/logo/logo.png" alt=""/>
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
                            {
                                loading ?
                                    (
                                        <Skeleton />
                                    ) :
                                    (
                                        cartData.items.length > 0 ? (
                                            <form className="cart-table" onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSubmit();
                                            }}>
                                                <div className="table-content table-responsive">
                                                    <i className="text-danger">* Lưu ý : Một số sản phẩm đã ngừng kinh doanh sẽ không hiển thị trong giỏ hàng của quý khách</i>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <th className="plantmore-product-select">Chọn</th>
                                                            <th className="plantmore-product-thumbnail">Hình ảnh</th>
                                                            <th className="cart-product-name">Sản phẩm</th>
                                                            <th className="plantmore-product-variant">Biến thể</th>
                                                            <th className="plantmore-product-price">Đơn giá</th>
                                                            <th className="plantmore-product-quantity">Số lượng</th>
                                                            <th className="plantmore-product-subtotal">Tổng</th>
                                                            <th className="plantmore-product-remove">Xóa</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {cartData.items.map((cart: any) => {
                                                            const selectedVariant = cart.available_variants.find(
                                                                (v: any) => v.size === selectedSizes[cart.id] && v.color === selectedColors[cart.id]
                                                            );
                                                            const displayImage = selectedVariant?.images?.length > 0
                                                                ? selectedVariant.images[0].image_url
                                                                : cart.image || "/img/default.jpg";
                                                            return (
                                                                <tr key={cart.id}>
                                                                    <td className="plantmore-product-select">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedItems[cart.id] || false}
                                                                            onChange={() => handleCheckboxChange(cart.id)}
                                                                        />
                                                                    </td>
                                                                    <td className="plantmore-product-thumbnail">
                                                                        <a href={`/chi-tiet-san-pham/${cart.product_id}`}>
                                                                            <img
                                                                                src={displayImage}
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
                                                                    <td className="plantmore-product-variant">
                                                                        <div>
                                                                            <span>Kích cỡ: {selectedSizes[cart.id]}</span><br />
                                                                            <span>Màu: {selectedColors[cart.id]}</span><br />
                                                                            <a href="#" className={'text-original-base'} onClick={(e) => { e.preventDefault(); openVariantModal(cart.id); }}>Thay đổi</a>
                                                                        </div>
                                                                    </td>
                                                                    <td className="plantmore-product-price">
                                                                <span
                                                                    className="amount">{convertToInt(cart.price)} vnđ</span>
                                                                    </td>
                                                                    <td className="plantmore-product-quantity">
                                                                        <div className="d-flex justify-content-center">
                                                                            <div className="input-group"
                                                                                 style={{width: "150px"}}>
                                                                                <button
                                                                                    className="btn btn-outline-secondary "
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
                                                                        </div>
                                                                        {errorQty[cart.id] && <div
                                                                            className="text-danger mt-1">{errorQty[cart.id]}</div>}
                                                                    </td>
                                                                    <td className="product-subtotal">
                                                                <span
                                                                    className="amount">{convertToInt(cart.total)} vnđ</span>
                                                                    </td>
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
                                                                </tr>
                                                            )
                                                        })}
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
                                                            <button type="submit"
                                                                    className="btn text-white mt-3 bg-original-base">
                                                                Tiến hành thanh toán
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <p className="mt-3 fs-6">Chưa có sản phẩm nào trong giỏ hàng!</p>
                                        )
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Chọn biến thể"
                visible={showVariantModal}
                onCancel={() => setShowVariantModal(false)}
                onOk={handleConfirmVariant}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ disabled: availableStock <= 0 || !tempVariant }}
            >
                {currentCartId && (() => {
                    const item = cartData.items.find((i: any) => i.id === currentCartId) as any;
                    const availableVariants = item.available_variants;
                    const colors = [...new Set(availableVariants.map((v: any) => v.color))];
                    const filteredSizes = availableVariants.filter((v: any) => v.color === tempColor);
                    const uniqueAvailableSizes = [...new Set(filteredSizes.map((s: any) => s.size))];

                    return (
                        <div>
                            <img src={tempImage} alt={item.product_name} style={{ height: 200, marginBottom: 10 }} />
                            <h3>{item.product_name}</h3>
                            <div className="mb-3">
                                <label>Màu sắc:</label>
                                <div className="d-flex flex-wrap">
                                    {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                    {/*@ts-ignore*/}
                                    {colors.map((color: string) => {
                                        const repVariant = availableVariants.find((v: any) => v.color === color);
                                        const repImg = repVariant?.images[0]?.image_url;
                                        const isSelected = tempColor === color;
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    setTempColor(color);
                                                    const currentSizeAvailable = uniqueAvailableSizes.includes(tempSize);
                                                    if (!currentSizeAvailable) {
                                                        setTempSize('');
                                                        setTempVariant(null);
                                                    } else {
                                                        const newV = availableVariants.find((v: any) => v.color === color && v.size === tempSize);
                                                        setTempVariant(newV);
                                                        setTempImage(newV?.images[0]?.image_url || item.image);
                                                    }
                                                    if (!tempSize || !currentSizeAvailable) {
                                                        setTempImage(repVariant?.images[0]?.image_url || item.image);
                                                    }
                                                }}
                                                className={`m-1 p-2 border ${isSelected ? 'border-danger bg-light' : 'border-secondary'}`}
                                                style={{ cursor: 'pointer', minWidth: 80 }}
                                            >
                                                {repImg ? <img src={repImg} alt={color} width={50} /> : color}
                                                <br />
                                                {color}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="mb-3">
                                <label>Kích cỡ:</label>
                                <div className="d-flex flex-wrap">
                                    {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                    {/*@ts-ignore*/}
                                    {uniqueAvailableSizes.map((size: string) => {
                                        const v = filteredSizes.find((vv: any) => vv.size === size);
                                        const isSelected = tempSize === size;
                                        const disabled = !v || v.quantity <= 0;
                                        return (
                                            <button
                                                key={size}
                                                disabled={disabled}
                                                onClick={() => {
                                                    setTempSize(size);
                                                    setTempVariant(v);
                                                    setTempImage(v?.images[0]?.image_url || item.image);
                                                }}
                                                className={`m-1 p-2 border ${isSelected ? 'border-danger bg-light' : 'border-secondary'} ${disabled ? 'text-muted' : ''}`}
                                                style={{ cursor: disabled ? 'not-allowed' : 'pointer', minWidth: 60 }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {tempVariant && <p>Còn lại: {availableStock} sản phẩm</p>}
                        </div>
                    );
                })()}
            </Modal>
        </>
    );
};