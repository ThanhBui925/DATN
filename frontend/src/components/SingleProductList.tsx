import { Link } from "react-router-dom";

export const SingleProductList = ({ product } : { product: any}) => {
    const rating = product.rating || 4;
    const stars = Array(5).fill(0).map((_, index) => (
        <li key={index} className={index < rating ? "" : "no-star"}>
            <i className="fa fa-star"></i>
        </li>
    ));

    const displayPrice = product.sale_price && product.sale_end ? product.sale_price : product.price;
    const hasSale = product.sale_price && product.sale_end;

    const primaryImage = product.image || product.images?.[0]?.url || "/img/product/placeholder.jpg";

    return (
        <div className="row product-layout-list">
            <div className="col-lg-4 col-md-5">
                <div className="product-image">
                    <Link to={`/chi-tiet-san-pham/${product.id}`}>
                        <img alt={product.name} src={primaryImage} className="primary-image" />
                    </Link>
                </div>
            </div>
            <div className="col-lg-8 col-md-7">
                <div className="product_desc">
                    <div className="product_desc_info">
                        <div className="rating-box">
                            <ul className="rating">
                                {stars}
                            </ul>
                        </div>
                        <h4>
                            <Link to={`/chi-tiet-san-pham/${product.id}`} className="product_name">
                                {product.name}
                            </Link>
                        </h4>
                        <div className="manufacturer">
                            <Link to={`/chi-tiet-san-pham/${product.id}`}>
                                {product.category?.name || "Nhà sản xuất"}
                            </Link>
                        </div>
                        <div className="price-box">
                            <span className="new-price">
                                {parseFloat(displayPrice).toLocaleString("vi-VN")} VNĐ
                            </span>
                            {hasSale && (
                                <span className="old-price">
                                    {parseFloat(product.price).toLocaleString("vi-VN")} VNĐ
                                </span>
                            )}
                        </div>
                        <p>
                            {product.description.length > 150
                                ? `${product.description.substring(0, 150)}...`
                                : product.description}
                        </p>
                        <div className="list-add-actions">
                            <ul>
                                <li className="add-cart">
                                    <Link to="#">Thêm vào giỏ</Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        data-bs-target="#exampleModalCenter"
                                        data-bs-toggle="modal"
                                        className="quick-view"
                                    >
                                        <i className="ion-android-open"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/chi-tiet-san-pham/${product.id}`} className="links-details">
                                        <i className="ion-clipboard"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};