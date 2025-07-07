import React from "react";
import {convertToInt} from "../helpers/common";
import {Link} from "react-router-dom";

export const SingleProduct= ({product}: { product: any }) => {
    return (
        <div className="product-list-area p-2 p-md-3">
            <div className="product-grid">
                <div className="single-product-wrap" key={product.id}>
                    <div className="product-image">
                        <Link to={`/chi-tiet-san-pham/${product.id}`}>
                            <img
                                className="primary-image"
                                src={product.image || "/img/default.jpg"}
                                alt={product.name}
                                style={{width: "100%", height: "250px", objectFit: "cover"}}
                            />
                            <img
                                className="secondary-image"
                                src={
                                    product.secondary_image ||
                                    product.image ||
                                    "/img/default.jpg"
                                }
                                alt={product.name}
                                style={{width: "100%", height: "250px", objectFit: "cover"}}
                            />
                        </Link>
                        <div className="label-product">-10% off</div>
                    </div>

                    <div className="product_desc">
                        <div className="product_desc_info">
                            <div className="rating-box">
                                <ul className="rating">
                                    <li>
                                        <i className="fa fa-star"></i>
                                    </li>
                                    <li>
                                        <i className="fa fa-star"></i>
                                    </li>
                                    <li>
                                        <i className="fa fa-star"></i>
                                    </li>
                                    <li className="no-star">
                                        <i className="fa fa-star"></i>
                                    </li>
                                    <li className="no-star">
                                        <i className="fa fa-star"></i>
                                    </li>
                                </ul>
                            </div>
                            <h4>
                                <Link
                                    className="product_name"
                                    to={`/chi-tiet-san-pham/${product.id}`}
                                >
                                    {product.name}
                                </Link>
                            </h4>


                            <div className="category">
                                <span>{product.category?.name || "Không rõ danh mục"}</span>
                            </div>


                            <div className="price-box">
                                <span className="new-price text-original-base">
                                    {convertToInt(product.price)} đ
                                </span>
                                {product.old_price && (
                                    <span className="old-price">
                                        {convertToInt(product.old_price)} đ
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="add-actions">
                            <ul className="add-actions-link">
                                <li className="add-cart">
                                    <Link className={`mt-1`} to={`/chi-tiet-san-pham/${product.id}`}>
                                        Xem chi tiết
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        className="quick-view"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModalCenter"
                                        href="#"
                                    >
                                        <i className="ion-android-open"></i>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="links-details"
                                        href={`/chi-tiet-san-pham/${product.id}`}
                                    >
                                        <i className="ion-clipboard"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
