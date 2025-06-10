export const DetailProduct = (props: any) => {
    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="row single-product-area">
                        <div className="col-xl-4  col-lg-6 offset-xl-1 col-md-5 col-sm-12">
                            <div className="single-product-tab">
                                <div className="zoomWrapper">
                                    <div id="img-1" className="zoomWrapper single-zoom">
                                        <a href="#">
                                            <img id="zoom1" src="/img/product/lg-product-1.jpg"
                                                 data-zoom-image="/img/product/lg-product-1.jpg" alt="big-1"/>
                                        </a>
                                    </div>
                                    <div className="single-zoom-thumb">
                                        <ul className="s-tab-zoom single-product-active owl-carousel"
                                            id="gallery_01">
                                            <li>
                                                <a href="#" className="elevatezoom-gallery active" data-update=""
                                                   data-image="/img/product/lg-product-1.jpg"
                                                   data-zoom-image="/img/product/lg-product-1.jpg"><img
                                                    src="/img/product/1.jpg" alt="zo-th-1"/></a>
                                            </li>
                                            <li className="">
                                                <a href="#" className="elevatezoom-gallery"
                                                   data-image="/img/product/lg-product-2.jpg"
                                                   data-zoom-image="/img/product/lg-product-2.jpg"><img
                                                    src="/img/product/2.jpg" alt="zo-th-2"/></a>
                                            </li>
                                            <li className="">
                                                <a href="#" className="elevatezoom-gallery"
                                                   data-image="/img/product/lg-product-3.jpg"
                                                   data-zoom-image="/img/product/lg-product-3.jpg"><img
                                                    src="/img/product/3.jpg" alt="ex-big-3"/></a>
                                            </li>
                                            <li className="">
                                                <a href="#" className="elevatezoom-gallery"
                                                   data-image="/img/product/lg-product-4.jpg"
                                                   data-zoom-image="/img/product/lg-product-4.jpg"><img
                                                    src="/img/product/4.jpg" alt="zo-th-4"/></a>
                                            </li>
                                            <li className="#">
                                                <a href="#" className="elevatezoom-gallery"
                                                   data-image="/img/product/lg-product-5.jpg"
                                                   data-zoom-image="/img/product/lg-product-5.jpg"><img
                                                    src="/img/product/5.jpg" alt="zo-th-5"/></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-6 col-md-7 col-sm-12">
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
                                    <div className="social-sharing">
                                        <h3>Share</h3>
                                        <ul>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                            <li><a href="#"><i className="fa fa-pinterest"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
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
                                    <li className="active"><a href="#description" data-bs-toggle="tab"
                                                              className="active show">Description</a></li>
                                    <li><a href="#review" data-bs-toggle="tab">Reviews (1)</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="discription-content">
                            <div className="tab-content">
                                <div className="tab-pane fade in active show" id="description">
                                    <div className="description-content">
                                        <p>Fashion has been creating well-designed collections since 2010. The brand
                                            offers feminine designs delivering stylish separates and statement
                                            dresses which have since evolved into a full ready-to-wear collection in
                                            which every item is a vital part of a woman's wardrobe. The result?
                                            Cool, easy, chic looks with youthful elegance and unmistakable signature
                                            style. All the beautiful pieces are made in Italy and manufactured with
                                            the greatest attention. Now Fashion extends to a range of accessories
                                            including shoes, hats, belts and more!</p>
                                    </div>
                                </div>
                                <div id="review" className="tab-pane fade">
                                    <form className="form-review">
                                        <div className="review">
                                            <table className="table table-striped table-bordered table-responsive">
                                                <tbody>
                                                <tr>
                                                    <td className="table-name"><strong>Palora Themes</strong></td>
                                                    <td className="text-right">08/06/2018</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <p>It’s both good and bad. If Nikon had achieved a
                                                            high-quality wide lens camera with a 1 inch sensor, that
                                                            would have been a very competitive product. So in that
                                                            sense, it’s good for us. But actually, from the
                                                            perspective of driving the 1 inch sensor market, we want
                                                            to stimulate this market and that means multiple
                                                            manufacturers.</p>
                                                        <ul>
                                                            <li><i className="fa fa-star-o"></i></li>
                                                            <li><i className="fa fa-star-o"></i></li>
                                                            <li><i className="fa fa-star-o"></i></li>
                                                            <li><i className="fa fa-star-o"></i></li>
                                                            <li><i className="fa fa-star-o"></i></li>
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
                                                    <input type="text" className="form-control"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col">
                                                    <label className="control-label">Your Review</label>
                                                    <textarea className="form-control"></textarea>
                                                    <div className="help-block"><span
                                                        className="text-danger">Note:</span> HTML is not translated!
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col">
                                                    <label className="control-label">Rating</label>
                                                    &nbsp;&nbsp;&nbsp; Bad&nbsp;
                                                    <input type="radio" value="1" name="rating"/>
                                                    &nbsp;
                                                    <input type="radio" value="2" name="rating"/>
                                                    &nbsp;
                                                    <input type="radio" value="3" name="rating"/>
                                                    &nbsp;
                                                    <input type="radio" value="4" name="rating"/>
                                                    &nbsp;
                                                    <input type="radio" value="5" name="rating"/>
                                                    &nbsp;Good
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buttons clearfix">
                                            <div className="pull-right">
                                                <button className="button-review" type="button">Continue</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}