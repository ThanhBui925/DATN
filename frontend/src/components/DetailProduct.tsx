import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spin, Row, Col, Image } from "antd";
import { convertToInt } from "../helpers/common";

export const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(res.data.data || res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Lấy danh sách size duy nhất từ variants
const sizeOptions = Array.from(
  new Set(
    product?.variants
      ?.map((variant: any) => variant.size?.name)
      .filter(Boolean)
  )
);
// Tìm variant ứng với size được chọn
const selectedVariant = product?.variants?.find(
  (variant: any) => variant.size?.name === selectedSize
);

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="row single-product-area">
            <div className="col-xl-4 col-lg-6 offset-xl-1 col-md-5 col-sm-12">
              <div className="single-product-tab">
                <div className="zoomWrapper">
                  <div id="img-1" className="zoomWrapper single-zoom">
                    <a href="#">
                      <img
                        id="zoom1"
                        src={product.image || "/img/default.jpg"}
                        data-zoom-image={product.image || "/img/default.jpg"}
                        alt="product"
                      />
                    </a>
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

              <div className="row" style={{ marginTop: 40 }}>
                <div className="col">
                  <Row gutter={[8, 8]}>
                    {product?.images?.length > 0 ? (
                      product.images.map((img: any, index: number) => (
                        <Col key={index} span={4}>
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
              <div className="quick-view-content">
                <div className="product-info">
                  <h2>{product.name}</h2>
                  <div className="rating-box">
                    <ul className="rating">
                      {[...Array(5)].map((_, i) => (
                        <li key={i}>
                          <i className="fa fa-star"></i>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="price-box">
                    <span className="new-price">
                      {convertToInt(product.price)} VNĐ
                    </span>
                    {product.sale_price && (
                      <span className="old-price">
                        {convertToInt(product.sale_price)} VNĐ
                      </span>
                    )}
                  </div>
                  <p>{product.description}</p>



                <div className="modal-size mt-4">
  <h4 className="mb-4 text-lg font-semibold text-gray-800">Chọn Size</h4>
  <div className="flex flex-wrap gap-3">
    {sizeOptions.map((size, idx) => (
      <button
        key={idx}
        onClick={() => setSelectedSize(size as string)}
        className={`w-16 h-16 border rounded-xl flex items-center justify-center text-base font-semibold transition-all duration-200
          ${
            selectedSize === size
              ? "bg-black text-white border-black"
              : "bg-white text-gray-800 hover:border-black hover:text-black"
          }`}
      >
        {String(size)}
      </button>
    ))}
  </div>

  {/* In stock theo size */}
  {selectedSize && (
    <div className="instock mt-3">
      {selectedVariant?.quantity > 0 ? (
        <p className="text-green-600 font-medium">
          In stock: {selectedVariant.quantity}
        </p>
      ) : (
        <p className="text-red-500 font-medium">Out of stock</p>
      )}
    </div>
  )}
</div>





                  <div className="modal-color">
                    <h4>Color</h4>
                    <div className="color-list">
                      <ul>
                        {product?.variants?.map((variant: any, idx: number) => (
                          <li key={idx}>
                            <a href="#" className="color-circle">
                              {variant?.color?.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="quick-add-to-cart">
                    <form className="modal-cart">
                      <div className="quantity">
                        <label>Quantity</label>
                        <div className="cart-plus-minus">
                          <input
                            className="cart-plus-minus-box"
                            type="number"
                            defaultValue={1}
                          />
                        </div>
                      </div>
                      <button className="add-to-cart" type="submit">
                        Add to cart
                      </button>
                    </form>
                  </div>

                
                  <div className="social-sharing">
                    <h3>Share</h3>
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-google-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-pinterest"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-info-review">
            <div className="row">
              <div className="col">
                <div className="product-info-detailed">
                  <div className="discription-tab-menu">
                    <ul role="tablist" className="nav">
                      <li className="active">
                        <a
                          href="#description"
                          data-bs-toggle="tab"
                          className="active show"
                        >
                          Description
                        </a>
                      </li>
                      <li>
                        <a href="#review" data-bs-toggle="tab">
                          Reviews (1)
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="discription-content">
                  <div className="tab-content">
                    <div
                      className="tab-pane fade in active show"
                      id="description"
                    >
                      <div className="description-content">
                        <p>{product.description}</p>
                      </div>
                    </div>
                    <div id="review" className="tab-pane fade">
                      <form className="form-review">
                        <div className="review">
                          <table className="table table-striped table-bordered table-responsive">
                            <tbody>
                              <tr>
                                <td className="table-name">
                                  <strong>Người dùng</strong>
                                </td>
                                <td className="text-right">28/06/2025</td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  <p>
                                    Chất lượng sản phẩm rất tốt, sẽ ủng hộ tiếp!
                                  </p>
                                  <ul>
                                    {[...Array(5)].map((_, i) => (
                                      <li key={i}>
                                        <i className="fa fa-star-o"></i>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="review-wrap">
                          <h2>Write a review</h2>
                          <div className="form-group row">
                            <div className="col">
                              <label className="control-label">Your Name</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col">
                              <label className="control-label">
                                Your Review
                              </label>
                              <textarea className="form-control"></textarea>
                              <div className="help-block">
                                <span className="text-danger">Note:</span> HTML
                                is not translated!
                              </div>
                            </div>
                          </div>
                          <div className="form-group row">
                            <div className="col">
                              <label className="control-label">Rating</label>
                              &nbsp;&nbsp;&nbsp; Bad&nbsp;
                              <input type="radio" value="1" name="rating" />
                              &nbsp;
                              <input type="radio" value="2" name="rating" />
                              &nbsp;
                              <input type="radio" value="3" name="rating" />
                              &nbsp;
                              <input type="radio" value="4" name="rating" />
                              &nbsp;
                              <input type="radio" value="5" name="rating" />
                              &nbsp;Good
                            </div>
                          </div>
                        </div>
                        <div className="buttons clearfix">
                          <div className="pull-right">
                            <button className="button-review" type="button">
                              Continue
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
