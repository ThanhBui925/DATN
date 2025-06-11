export const SingleProduct = () => {
    return (
        <div className="single-product-wrap">
            <div className="product-image">
                <a href="single-product.html">
                    <img className="primary-image" src="/img/product/15.jpg" alt=""/>
                    <img className="secondary-image" src="/img/product/16.jpg" alt=""/>
                </a>
                <div className="label-product">-10% off</div>
            </div>
            <div className="product_desc">
                <div className="product_desc_info">
                    <div className="rating-box">
                        <ul className="rating">
                            <li><i className="fa fa-star"></i></li>
                            <li><i className="fa fa-star"></i></li>
                            <li><i className="fa fa-star"></i></li>
                            <li className="no-star"><i className="fa fa-star"></i></li>
                            <li className="no-star"><i className="fa fa-star"></i></li>
                        </ul>
                    </div>
                    <h4><a className="product_name" href="single-product.html">Air Jordan XI Retro</a></h4>
                    <div className="manufacturer"><a href="single-product.html">Fashion Manufacturer</a></div>
                    <div className="price-box">
                        <span className="new-price">$225.00</span>
                        <span className="old-price">$250.00</span>
                    </div>
                </div>
                <div className="add-actions">
                    <ul className="add-actions-link">
                        <li className="add-cart"><a href="#"><i className="ion-android-cart"></i> Add to cart</a></li>
                        <li><a className="quick-view" data-bs-toggle="modal" data-bs-target="#exampleModalCenter"
                               href="#"><i className="ion-android-open"></i></a></li>
                        <li><a className="links-details" href="single-product.html"><i
                            className="ion-clipboard"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}