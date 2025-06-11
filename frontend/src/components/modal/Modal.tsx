export const Modal = () => {
    return (
        <div className="modal fade modal-wrapper" id="exampleModalCenter">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-inner-area row">
                            <div className="col-lg-5 col-md-5 col-sm-12">
                                <div className="single-product-tab">
                                    <div className="zoomWrapper">
                                        <div id="img-1" className="zoomWrapper single-zoom">
                                            <a href="#">
                                                <img id="zoom1" src="img/product/1.jpg"
                                                     data-zoom-image="img/product/1.jpg" alt="big-1"/>
                                            </a>
                                        </div>
                                        <div className="single-zoom-thumb">
                                            <ul className="s-tab-zoom single-product-active owl-carousel"
                                                id="gallery_01">
                                                <li>
                                                    <a href="#" className="elevatezoom-gallery active" data-update=""
                                                       data-image="img/product/1.jpg"
                                                       data-zoom-image="img/product/1.jpg"><img src="img/product/1.jpg"
                                                                                                alt="zo-th-1"/></a>
                                                </li>
                                                <li className="">
                                                    <a href="#" className="elevatezoom-gallery"
                                                       data-image="img/product/2.jpg"
                                                       data-zoom-image="img/product/2.jpg"><img src="img/product/2.jpg"
                                                                                                alt="zo-th-2"/></a>
                                                </li>
                                                <li className="">
                                                    <a href="#" className="elevatezoom-gallery"
                                                       data-image="img/product/3.jpg"
                                                       data-zoom-image="img/product/3.jpg"><img src="img/product/3.jpg"
                                                                                                alt="ex-big-3"/></a>
                                                </li>
                                                <li className="">
                                                    <a href="#" className="elevatezoom-gallery"
                                                       data-image="img/product/4.jpg"
                                                       data-zoom-image="img/product/4.jpg"><img src="img/product/4.jpg"
                                                                                                alt="zo-th-4"/></a>
                                                </li>
                                                <li className="">
                                                    <a href="#" className="elevatezoom-gallery"
                                                       data-image="img/product/5.jpg"
                                                       data-zoom-image="img/product/5.jpg"><img src="img/product/5.jpg"
                                                                                                alt="zo-th-5"/></a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-12">
                                <div className="quick-view-content">
                                    <div className="product-info">
                                        <h2>Brand Name FREE RN 2018</h2>
                                        <div className="rating-box">
                                            <ul className="rating">
                                                <li><i className="fa fa-star"></i></li>
                                                <li><i className="fa fa-star"></i></li>
                                                <li><i className="fa fa-star"></i></li>
                                                <li><i className="fa fa-star"></i></li>
                                                <li><i className="fa fa-star"></i></li>
                                            </ul>
                                        </div>
                                        <div className="price-box">
                                            <span className="new-price">$225.00</span>
                                            <span className="old-price">$250.00</span>
                                        </div>
                                        <p>100% cotton double printed dress. Black and white striped top and orange high
                                            waisted skater skirt bottom.</p>
                                        <div className="modal-size">
                                            <h4>Size</h4>
                                            <select>
                                                <option title="S" value="1">S</option>
                                                <option title="M" value="2">M</option>
                                                <option title="L" value="3">L</option>
                                            </select>
                                        </div>
                                        <div className="modal-color">
                                            <h4>Color</h4>
                                            <div className="color-list">
                                                <ul>
                                                    <li><a href="#" className="orange active"></a></li>
                                                    <li><a href="#" className="paste"></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="quick-add-to-cart">
                                            <form className="modal-cart">
                                                <div className="quantity">
                                                    <label>Quantity</label>
                                                    <div className="cart-plus-minus">
                                                        <input className="cart-plus-minus-box" type="text" value="0"/>
                                                    </div>
                                                </div>
                                                <button className="add-to-cart" type="submit">Add to cart</button>
                                            </form>
                                        </div>
                                        <div className="instock">
                                            <p>In stock </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}