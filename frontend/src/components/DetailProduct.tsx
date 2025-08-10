import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { convertToInt } from "../helpers/common";
import { axiosInstance } from "../utils/axios";
import { TOKEN_KEY } from "../providers/authProvider";
import { Col, Image, notification, Row, Pagination, Rate, Spin } from "antd";
import emitter from "../utils/eventBus";
import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ImageType {
    url: string;
}

interface Variant {
    size?: { id: string; name: string };
    color?: { id: string; name: string; code?: string };
    quantity: number;
    images?: { image_url: string }[];
}

interface Product {
    id?: string;
    name: string;
    price: number;
    sale_price?: number;
    description: string;
    average_rating: number;
    review_count: number;
    total_ordered_quantity: number;
    image?: string;
    images?: ImageType[];
    variants?: Variant[];
}

interface Review {
    user?: { name?: string; avatar?: string };
    rating: number;
    comment: string;
    created_at: string;
}

interface SizeOption {
    id: string;
    name: string;
}

interface ColorOption {
    id: string;
    name: string;
    code: string;
}

export const DetailProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [reviewLoading, setReviewLoading] = useState<boolean>(false);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [errorQty, setErrorQty] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [cartQuantity, setCartQuantity] = useState<number>(0);
    const pageSize = 10;
    const navigate = useNavigate();
    const BASE_URL: string = import.meta.env.VITE_APP_API_URL + '/api';

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`${BASE_URL}/products/${id}`);
                setProduct(res.data.data || res.data);
            } catch (err: any) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                notification.error({ message: "Không thể tải chi tiết sản phẩm." });
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            setReviewLoading(true);
            try {
                const res = await axiosInstance.get(`${BASE_URL}/client/products/${id}/reviews`, {
                    params: { page: currentPage, limit: pageSize },
                });
                setReviews(res.data.data || []);
                setTotalReviews(res.data.total || 0);
            } catch (err: any) {
                console.error("Lỗi khi tải đánh giá:", err);
                notification.error({ message: "Không thể tải đánh giá." });
            } finally {
                setReviewLoading(false);
            }
        };
        fetchReviews();
    }, [id, currentPage]);

    useEffect(() => {
        const fetchCartQuantity = async () => {
            if (!selectedSize || !selectedColor || !localStorage.getItem(TOKEN_KEY)) {
                setCartQuantity(0);
                return;
            }
            try {
                const res = await axiosInstance.get(`${BASE_URL}/client/cart/items`, {
                    params: { product_id: id, size_id: selectedSize, color_id: selectedColor },
                });
                const cartItem = res.data.data?.find(
                    (item: any) => item.product_id === Number(id) && item.size_id === selectedSize && item.color_id === selectedColor
                );
                setCartQuantity(cartItem ? cartItem.quantity : 0);
            } catch (err: any) {
                console.error("Lỗi khi tải số lượng trong giỏ hàng:", err);
            }
        };
        fetchCartQuantity();
    }, [selectedSize, selectedColor, id]);

    const uniqueSizeOptions: SizeOption[] = Array.from(
        new Set(
            product?.variants?.map((variant: Variant) => variant.size?.id).filter((id: any) => id)
        )
    ).map((id: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const variant = product?.variants.find((v: Variant) => v.size?.id === id);
        return { id: variant!.size!.id, name: variant!.size!.name };
    });

    const uniqueColorOptions: ColorOption[] = Array.from(
        new Set(
            product?.variants?.map((variant: Variant) => variant.color?.id).filter((id: any) => id)
        )
    ).map((id: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const variant = product?.variants.find((v: Variant) => v.color?.id === id);
        return { id: variant!.color!.id, name: variant!.color!.name, code: variant!.color!.code || "#eee" };
    });

    const availableColors: ColorOption[] = selectedSize
        ? uniqueColorOptions.filter((color) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            product?.variants.some(
                (variant: Variant) => variant.size?.id === selectedSize && variant.color?.id === color.id
            )
        )
        : uniqueColorOptions;

    const availableSizes: SizeOption[] = selectedColor
        ? uniqueSizeOptions.filter((size) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            product?.variants.some(
                (variant: Variant) => variant.color?.id === selectedColor && variant.size?.id === size.id
            )
        )
        : uniqueSizeOptions;

    const selectedVariant: Variant | null = product?.variants?.find(
        (variant: Variant) =>
            variant.size?.id === selectedSize && variant.color?.id === selectedColor
    ) || null;

    const totalVariantQuantity: number = product?.variants?.reduce(
        (sum: number, variant: Variant) => sum + (variant.quantity || 0),
        0
    ) || 0;

    const availableQuantity: number = selectedVariant
        ? selectedVariant.quantity - cartQuantity
        : totalVariantQuantity;

    useEffect(() => {
        if (selectedVariant) {
            const newQuantity = Math.max(1, Math.min(quantity, availableQuantity));
            setQuantity(newQuantity);
            if (newQuantity > availableQuantity) {
                setErrorQty(
                    availableQuantity > 0
                        ? `Chỉ còn ${availableQuantity} sản phẩm khả dụng (đã trừ ${cartQuantity} trong giỏ hàng).`
                        : `Sản phẩm đã hết hàng.`
                );
            } else {
                setErrorQty('');
            }
        } else {
            setQuantity(1);
            setErrorQty('');
        }
    }, [selectedSize, selectedColor, selectedVariant, availableQuantity, cartQuantity]);

    const handleAddToCart = async () => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            alert("Vui lòng đăng nhập.");
            return navigate('/dang-nhap');
        }
        if (!selectedSize || !selectedColor) {
            setErrorQty("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.");
            return;
        }
        if (quantity > availableQuantity) {
            setErrorQty(
                availableQuantity > 0
                    ? `Chỉ còn ${availableQuantity} sản phẩm khả dụng (đã trừ ${cartQuantity} trong giỏ hàng).`
                    : `Sản phẩm đã hết hàng.`
            );
            return;
        }
        try {
            const payload = {
                product_id: Number(id),
                size_id: selectedSize,
                color_id: selectedColor,
                quantity,
            };
            const res = await axiosInstance.post(`${BASE_URL}/client/cart/items`, payload);
            if (res.data.status) {
                setErrorQty('');
                emitter.emit('addToCart');
                setCartQuantity((prev: number) => prev + quantity);
                notification.success({ message: res.data.message || "Sản phẩm đã được thêm vào giỏ hàng!" });
            }
        } catch (err: any) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            setErrorQty("Không thể thêm sản phẩm vào giỏ hàng.");
        }
    };

    const handleQuantityChange = (change: number) => {
        if (selectedVariant) {
            const newQuantity = Math.max(1, Math.min(quantity + change, availableQuantity));
            setQuantity(newQuantity);
            if (newQuantity > availableQuantity) {
                setErrorQty(
                    availableQuantity > 0
                        ? `Chỉ còn ${availableQuantity} sản phẩm khả dụng (đã trừ ${cartQuantity} trong giỏ hàng).`
                        : `Sản phẩm đã hết hàng.`
                );
            } else {
                setErrorQty('');
            }
        }
    };

    const displayedImages: ImageType[] = selectedVariant?.images?.length
        ? selectedVariant.images.map((img: any) => ({ url: img.image_url }))
        : product?.images || [];

    const handleSizeSelect = (size: SizeOption) => {
        if (!availableSizes.some((s: SizeOption) => s.id === size.id)) return;
        setSelectedSize(selectedSize === size.id ? null : size.id);
        setQuantity(1);
    };

    const handleColorSelect = (color: ColorOption) => {
        if (!availableColors.some((c: ColorOption) => c.id === color.id)) return;
        setSelectedColor(selectedColor === color.id ? null : color.id);
        setQuantity(1);
    };

    const sliderSettings: any = {
        dots: false,
        infinite: displayedImages.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: !selectedVariant && displayedImages.length > 1,
        autoplaySpeed: 2000,
        arrows: false,
    };

    const carouselSettings: any = {
        dots: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        infinite: product?.images?.length > 4,
        speed: 500,
        slidesToShow: Math.min(4, product?.images?.length || 1),
        slidesToScroll: 4,
        arrows: true,
    };

    if (loading || !product) {
        return (
            <div className="text-center py-5">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mb-3">
            <div className="row px-3">
                <div className="col-xl-5 col-lg-6 col-md-5 col-sm-12">
                    <div className="single-product-tab">
                        <div className="zoomWrapper">
                            {displayedImages.length > 1 ? (
                                <Slider {...sliderSettings}>
                                    {displayedImages.map((img: ImageType, index: number) => (
                                        <div key={index}>
                                            <img
                                                src={img.url || "/img/default.jpg"}
                                                alt={product.name}
                                                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            ) : displayedImages.length === 1 ? (
                                <img
                                    src={displayedImages[0].url || "/img/default.jpg"}
                                    alt={product.name}
                                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                                />
                            ) : (
                                <img
                                    src={product.image || "/img/default.jpg"}
                                    alt={product.name}
                                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                                />
                            )}
                        </div>
                        <div className="single-zoom-thumb mt-3">
                            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                            {/*@ts-ignore*/}
                            {product?.images?.length > 0 ? (
                                <Slider {...carouselSettings}>
                                    {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                    {/*@ts-ignore*/}
                                    {product.images.map((img: ImageType, index: number) => (
                                        <div key={index} style={{ padding: "0 5px" }}>
                                            <Image
                                                src={img.url}
                                                alt={`thumb-${index}`}
                                                style={{
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                    border: "1px solid #eee",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <p
                                    style={{
                                        marginTop: 12,
                                        fontStyle: "italic",
                                        color: "#888",
                                        textAlign: "center",
                                    }}
                                >
                                    Chưa có ảnh mô tả
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-6 col-md-7 col-sm-12">
                    <div className="py-3 py-md-0 mt-5 mt-md-0">
                        <h2 className="fw-bold">{product.name}</h2>
                        <div className="d-flex align-items-center mb-2">
                            <div className="d-flex gap-1">
                                <span className="text-decoration-underline"> { product.average_rating }</span>
                                <span className="text-warning">
                  {[...Array(5)].map((_, i: number) => (
                      <i key={i} className="fa fa-star"></i>
                  ))}
                </span>
                            </div>
                            <span className="ms-2">
                | <span className="text-decoration-underline">{product.review_count}</span> đánh giá |
              </span>
                            <span className="ms-2">
                Đã bán <span className="text-decoration-underline">{ product.total_ordered_quantity }</span>
              </span>
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
                                {uniqueSizeOptions.map((size: SizeOption, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`border ${selectedSize === size.id ? 'border-danger' : 'border-secondary'} ${
                                            !availableSizes.some((s: SizeOption) => s.id === size.id) ? 'opacity-50' : ''
                                        }`}
                                        onClick={() => handleSizeSelect(size)}
                                        style={{
                                            width: "40px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            cursor: !availableSizes.some((s: SizeOption) => s.id === size.id) ? 'not-allowed' : 'pointer',
                                            pointerEvents: !availableSizes.some((s: SizeOption) => s.id === size.id) ? 'none' : 'auto',
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
                                {uniqueColorOptions.map((color: ColorOption, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`border ${selectedColor === color.id ? 'border-danger' : 'border-secondary'} ${
                                            !availableColors.some((c: ColorOption) => c.id === color.id) ? 'opacity-50' : ''
                                        }`}
                                        onClick={() => handleColorSelect(color)}
                                        style={{
                                            width: "40px",
                                            height: "30px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            cursor: !availableColors.some((c: ColorOption) => c.id === color.id) ? 'not-allowed' : 'pointer',
                                            pointerEvents: !availableColors.some((c: ColorOption) => c.id === color.id) ? 'none' : 'auto',
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
                                            if (value > availableQuantity) {
                                                setErrorQty(
                                                    availableQuantity > 0
                                                        ? `Chỉ còn ${availableQuantity} sản phẩm khả dụng (đã trừ ${cartQuantity} trong giỏ hàng).`
                                                        : `Sản phẩm đã hết hàng.`
                                                );
                                            } else {
                                                setErrorQty('');
                                            }
                                            setQuantity(Math.max(1, Math.min(value, availableQuantity)));
                                        }}
                                        min="1"
                                        max={availableQuantity}
                                        style={{ border: "1px solid gray" }}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= availableQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="ms-3 text-muted">
                  {availableQuantity > 0 ? `${availableQuantity} sản phẩm khả dụng` : 'Hết hàng'}
                </span>
                            </div>
                            {errorQty && <div className="text-danger mt-1">{errorQty}</div>}
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-danger w-100 py-2"
                            style={{ backgroundColor: "#eb3e32" }}
                            disabled={!selectedSize || !selectedColor || quantity > availableQuantity || errorQty !== ''}
                        >
                            Thêm Vào Giỏ Hàng
                        </button>
                        <div className="mt-3">
                            <h4>Chia sẻ</h4>
                            <div className="d-flex gap-2">
                                <a href="#" className="btn btn-outline-secondary">
                                    <i className="fa fa-facebook"></i>
                                </a>
                                <a href="#" className="btn btn-outline-secondary">
                                    <i className="fa fa-twitter"></i>
                                </a>
                                <a href="#" className="btn btn-outline-secondary">
                                    <i className="fa fa-pinterest"></i>
                                </a>
                                <button style={{ backgroundColor: "#eb3e32" }} className="btn btn-danger">
                                    <i className="fa fa-heart"></i> Đã thích (218)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <div>
                        <section className="desc-section mb-3 mt-4">
                            <div className="section-title-3">
                                <h2>Mô tả sản phẩm</h2>
                            </div>
                            <p>{product.description}</p>
                        </section>

                        <section className="rate-section mb-3">
                            <div className="section-title-3">
                                <h2>Đánh giá ({product.review_count})</h2>
                            </div>
                            {reviewLoading ? (
                                <div className="text-center py-5">
                                    <Spin size="large" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                            ) : (
                                <div>
                                    {reviews.map((review: Review, index: number) => (
                                        <div
                                            key={index}
                                            className="border-bottom py-3"
                                            style={{ marginBottom: "20px" }}
                                        >
                                            <div className="d-flex align-items-center mb-2">
                                                <img
                                                    src={review.user?.avatar || "/img/default-avatar.jpg"}
                                                    alt="avatar"
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        borderRadius: "50%",
                                                        marginRight: "10px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <div>
                                                    <strong>{review.user?.name || "Ẩn danh"}</strong>
                                                    <div>
                                                        <Rate
                                                            disabled
                                                            value={review.rating}
                                                            style={{ fontSize: "14px", color: "#fadb14" }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="ms-auto text-muted">
                          {moment(review.created_at).format("DD/MM/YYYY HH:mm")}
                        </span>
                                            </div>
                                            <p className="mb-2">{review.comment}</p>
                                        </div>
                                    ))}
                                    <div className="text-center mt-4">
                                        <Pagination
                                            current={currentPage}
                                            total={product.review_count}
                                            pageSize={pageSize}
                                            onChange={(page: number) => setCurrentPage(page)}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};