import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertToInt } from "../helpers/common";
import { axiosInstance } from "../utils/axios";
import { TOKEN_KEY } from "../providers/authProvider";
import {Col, Image, notification, Row} from "antd";
import emitter from "../utils/eventBus";

export const DetailProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [errorQty, setErrorQty] = useState('');
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_APP_API_URL + '/api';

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`${BASE_URL}/products/${id}`);
                setProduct(res.data.data || res.data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                alert("Không thể tải chi tiết sản phẩm.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const uniqueSizeOptions = Array.from(
        new Set(
            product?.variants?.map((variant: any) => variant.size?.id).filter((id: any) => id)
        )
    ).map((id: any) => {
        const variant = product?.variants.find((v: any) => v.size?.id === id);
        return { id: variant.size?.id, name: variant.size?.name };
    });

    const uniqueColorOptions = Array.from(
        new Set(
            product?.variants?.map((variant: any) => variant.color?.id).filter((id: any) => id)
        )
    ).map((id: any) => {
        const variant = product?.variants.find((v: any) => v.color?.id === id);
        return { id: variant.color?.id, name: variant.color?.name, code: variant.color?.code || "#eee" };
    });

    const availableColors = selectedSize
        ? uniqueColorOptions.filter((color) =>
            product?.variants.some(
                (variant: any) => variant.size?.id === selectedSize && variant.color?.id === color.id
            )
        )
        : uniqueColorOptions;

    const availableSizes = selectedColor
        ? uniqueSizeOptions.filter((size) =>
            product?.variants.some(
                (variant: any) => variant.color?.id === selectedColor && variant.size?.id === size.id
            )
        )
        : uniqueSizeOptions;

    const selectedVariant = product?.variants?.find(
        (variant: any) =>
            variant.size?.id === selectedSize && variant.color?.id === selectedColor
    ) || null;

    const totalInventory = product?.variants?.reduce(
        (sum: number, variant: any) => sum + (variant.quantity || 0),
        0
    );

    useEffect(() => {
        if (selectedVariant) {
            if (quantity > selectedVariant.quantity) {
                setQuantity(selectedVariant.quantity);
                setErrorQty(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedVariant.quantity} sản phẩm.`);
            } else {
                setErrorQty('');
            }
        }
    }, [selectedSize, selectedColor, selectedVariant, quantity]);

    const handleAddToCart = async () => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            alert("Vui lòng đăng nhập.");
            return navigate('/dang-nhap');
        }
        if (!selectedSize || !selectedColor) {
            setErrorQty("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.");
            return;
        }
        if (quantity > (selectedVariant?.quantity || 0)) {
            setErrorQty(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedVariant?.quantity} sản phẩm.`);
            return;
        }
        try {
            const payload = {
                product_id: Number(id),
                size_id: selectedSize,
                color_id: selectedColor,
                quantity,
            };
            await axiosInstance.post(`${BASE_URL}/client/cart/items`, payload);
            setErrorQty('');
            emitter.emit('addToCart');
            notification.success({message: "Sản phẩm đã được thêm vào giỏ hàng!"});
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            setErrorQty("Không thể thêm sản phẩm vào giỏ hàng.");
        }
    };

    const handleQuantityChange = (change: number) => {
        if (selectedVariant) {
            const newQuantity = Math.max(1, Math.min(quantity + change, selectedVariant.quantity));
            setQuantity(newQuantity);
            if (newQuantity > selectedVariant.quantity) {
                setErrorQty(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedVariant.quantity} sản phẩm.`);
            } else {
                setErrorQty('');
            }
        }
    };

    if (loading || !product) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mb-3">
            <div className="row px-3">
                <div className="col-xl-5 col-lg-6 col-md-5 col-sm-12">
                    <div className="single-product-tab">
                        <div className="zoomWrapper">
                            <div id="img-1" className="zoomWrapper single-zoom">
                                <img
                                    id="zoom1"
                                    src={product.image || "/img/default.jpg"}
                                    data-zoom-image={product.image || "/img/default.jpg"}
                                    alt={product.name}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="single-zoom-thumb">
                                <ul
                                    className="s-tab-zoom single-product-active owl-carousel"
                                    id="gallery_01"
                                >
                                    {product?.images?.map((img: any, index: number) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className="elevatezoom-gallery active"
                                                data-image={img.url}
                                                data-zoom-image={img.url}
                                            >
                                                <img src={img.url} alt={`thumb-${index}`} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col">
                            <Row gutter={[8, 8]}>
                                {product?.images?.length > 0 ? (
                                    product.images.map((img: any, index: number) => (
                                        <Col key={index} span={6}>
                                            <Image
                                                src={img.url}
                                                style={{
                                                    width: "100%",
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 6,
                                                    border: "1px solid #eee",
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                                }}
                                                preview={true}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <p
                                            style={{
                                                marginTop: 12,
                                                fontStyle: "italic",
                                                color: "#888",
                                            }}
                                        >
                                            Chưa có ảnh mô tả
                                        </p>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-6 col-md-7 col-sm-12">
                    <div className="py-3 py-md-0">
                        <h2 className="fw-bold">{product.name}</h2>
                        <div className="d-flex align-items-center mb-2">
                            <div className={`d-flex gap-1`}>
                                <span className={`text-decoration-underline`}>5.0</span>
                                <span className="text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fa fa-star"></i>
                                    ))}
                                </span>
                            </div>
                            <span className="ms-2">| <span className={`text-decoration-underline`}>1.2k</span> đánh giá |</span>
                            <span className="ms-2">Đã bán <span
                                className={`text-decoration-underline`}>7.2k</span></span>
                        </div>
                        <div className="p-5" style={{ backgroundColor: "#fafafa" }}>
                            <span className="h4 text-original-base">{convertToInt(product.price)}đ</span>
                            {product.sale_price && (
                                <span className="text-muted text-decoration-line-through ms-2">
                                    {convertToInt(product.sale_price)}đ
                                </span>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="me-3">Chọn kích cỡ</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {uniqueSizeOptions.map((size: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`border ${selectedSize === size.id ? 'border-danger' : 'border-secondary'} ${
                                            !availableSizes.some((s: any) => s.id === size.id) ? 'opacity-50' : ''
                                        }`}
                                        onClick={() => selectedSize === size.id ? setSelectedSize(null) : setSelectedSize(size.id)}
                                        style={{
                                            width: "40px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            cursor: !availableSizes.some((s: any) => s.id === size.id) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {size.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="me-3">Chọn màu</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {uniqueColorOptions.map((color: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`border ${selectedColor === color.id ? 'border-danger' : 'border-secondary'} ${
                                            !availableColors.some((c: any) => c.id === color.id) ? 'opacity-50' : ''
                                        }`}
                                        onClick={() => selectedColor === color.id ? setSelectedColor(null) : setSelectedColor(color.id)}
                                        style={{
                                            width: "40px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            cursor: !availableColors.some((c: any) => c.id === color.id) ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {color.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="qty-component mb-3">
                            <label className="me-3">Số lượng</label>
                            <div className="mb-1 d-flex align-items-center">
                                <div className="input-group" style={{ width: "150px" }}>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            if (selectedVariant && value > selectedVariant.quantity) {
                                                setErrorQty(`Chỉ còn lại ${selectedVariant.quantity} sản phẩm`);
                                            } else {
                                                setErrorQty('');
                                            }
                                            setQuantity(Math.max(1, Math.min(value, selectedVariant?.quantity || 100)));
                                        }}
                                        min="1"
                                        max={selectedVariant?.quantity}
                                        style={{ border: "1px solid gray" }}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={selectedVariant && quantity >= selectedVariant.quantity}
                                    >
                                        +
                                    </button>
                                </div>
                                <span
                                    className="ms-3 text-muted">{selectedVariant ? selectedVariant.quantity : totalInventory} sản phẩm có sẵn</span>
                            </div>
                            {errorQty && <div className="text-danger mt-1">{errorQty}</div>}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-danger w-100 py-2"
                            style={{ backgroundColor: "#eb3e32" }}
                            disabled={!selectedSize || !selectedColor || quantity > (selectedVariant?.quantity || 0) || errorQty !== ''}
                        >
                            Thêm Vào Giỏ Hàng
                        </button>
                        <div className="mt-3">
                            <h4>Chia sẻ</h4>
                            <div className="d-flex gap-2">
                                <a href="#" className="btn btn-outline-secondary"><i className="fa fa-facebook"></i></a>
                                <a href="#" className="btn btn-outline-secondary"><i className="fa fa-twitter"></i></a>
                                <a href="#" className="btn btn-outline-secondary"><i
                                    className="fa fa-pinterest"></i></a>
                                <button style={{ backgroundColor: "#eb3e32" }} className="btn btn-danger"><i
                                    className="fa fa-heart"></i> Đã thích (218)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <div>
                        <section className="desc-section mb-3">
                            <div className="section-title-3">
                                <h2>Mô tả sản phẩm</h2>
                            </div>
                            <p>{product.description}</p>
                        </section>

                        <section className="rate-section mb-3">
                            <div className="section-title-3">
                                <h2>Đánh giá</h2>
                            </div>
                            <table className="table table-striped table-bordered">
                                <tbody>
                                <tr>
                                    <td><strong>Người dùng</strong></td>
                                    <td className="text-end">28/06/2025</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <p>Chất lượng sản phẩm rất tốt, sẽ ủng hộ tiếp!</p>
                                        <div className="d-flex">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fa fa-star-o text-warning"></i>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};