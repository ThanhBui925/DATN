import React from "react";
import {convertToInt} from "../helpers/common";
import axios from "axios";

export const SingleProduct= ({product}: { product: any }) => {
    return (
        <div className="product-list-area" style={{padding: "40px"}}>
            <div className="product-grid">
                <div className="single-product-wrap" key={product.id}>
                    <div className="product-image">
                        <a href={`/chi-tiet-san-pham/${product.id}`}>
                            <img
                                className="primary-image"
                                src={product.image || "/img/default.jpg"}
                                alt={product.name}
                            />
                            <img
                                className="secondary-image"
                                src={
                                    product.secondary_image ||
                                    product.image ||
                                    "/img/default.jpg"
                                }
                                alt={product.name}
                            />
                        </a>
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
                                <a
                                    className="product_name"
                                    href={`/chi-tiet-san-pham/${product.id}`}
                                >
                                    {product.name}
                                </a>
                            </h4>


                            <div className="category">
                                <span>{product.category?.name || "Không rõ danh mục"}</span>
                            </div>


                            <div className="price-box">
                                <span className="new-price">
                                    {convertToInt(product.price)} vnđ
                                </span>
                                {product.old_price && (
                                    <span className="old-price">
                                        {convertToInt(product.old_price)} vnđ
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="add-actions">
                            <ul className="add-actions-link">
                                <li className="add-cart">
                                    <a href="#">
                                        <i className="ion-android-cart"></i> Thêm vào giỏ
                                    </a>
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
