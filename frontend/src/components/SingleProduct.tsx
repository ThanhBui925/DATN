import {Link} from "react-router-dom";

export const SingleProduct = () => {
    return (
        <div className="single-product-wrap">
            <div className="product-image">
                <Link to="/chi-tiet-san-pham/1">
                    <img className="primary-image" src="/img/product/15.jpg" alt=""/>
                    <img className="secondary-image" src="/img/product/16.jpg" alt=""/>
                </Link>
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
                    <h4><Link className="product_name" to="/chi-tiet-san-pham/1">Air Jordan XI Retro</Link></h4>
                    <div className="manufacturer"><Link to="/chi-tiet-san-pham/1">Fashion Manufacturer</Link></div>
                    <div className="price-box">
                        <span className="new-price">$225.00</span>
                        <span className="old-price">$250.00</span>
                    </div>
                </div>
                <div className="add-actions">
                    <ul className="add-actions-link">
                        <li className="add-cart"><Link to="#"><i className="ion-android-cart"></i> Add to cart</Link></li>
                        <li><Link className="quick-view" data-bs-toggle="modal" data-bs-target="#exampleModalCenter"
                               to="#"><i className="ion-android-open"></i></Link></li>
                        <li><Link className="links-details" to="/chi-tiet-san-pham/1"><i
                            className="ion-clipboard"></i></Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}