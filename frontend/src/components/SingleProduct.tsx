// ProductList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import { convertToInt } from "../helpers/common";

export const SingleProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/products");
        setProducts(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list-area" style={{ padding: "40px" }}>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product: any) => (
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
          ))}
        </div>
      )}
    </div>
  );
};
