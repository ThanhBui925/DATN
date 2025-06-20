import {Link} from "react-router-dom";

export const HeaderMid = () => {
    return (
        <div className="header-mid-area">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3 col md-custom-12">
                        <div className="logo">
                            <Link to="/trang-chu"><img src="/img/logo/logo.png" alt=""/></Link>
                        </div>
                    </div>
                    <div className="col-lg-9 md-custom-12">
                        <div className="shopping-cart-box">
                            <ul>
                                <li>
                                    <Link to="/gio-hang">
                                                <span className="item-cart-inner">
                                                    <span className="item-cont">2</span>
                                                    Giỏ hàng
                                                </span>
                                        <div className="item-total">$237.00</div>
                                    </Link>
                                    <ul className="shopping-cart-wrapper">
                                        <li>
                                            <div className="shoping-cart-image">
                                                <a href="#">
                                                    <img src="/img/small-product/1.jpg" alt=""/>
                                                    <span className="product-quantity">1x</span>
                                                </a>
                                            </div>
                                            <div className="shoping-product-details">
                                                <h3><a href="#">brand Free RN 2018</a></h3>
                                                <div className="price-box">
                                                    <span>$230.00</span>
                                                </div>
                                                <div className="sizeandcolor">
                                                    <span>Size: S</span>
                                                    <span>Color: Orange</span>
                                                </div>
                                                <div className="remove">
                                                    <button title="Remove"><i className="ion-android-delete"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="shoping-cart-image">
                                                <a href="#">
                                                    <img src="/img/small-product/2.jpg" alt=""/>
                                                    <span className="product-quantity">1x</span>
                                                </a>
                                            </div>
                                            <div className="shoping-product-details">
                                                <h3><a href="#">Product Free RN 2018</a></h3>
                                                <div className="price-box">
                                                    <span>$230.00</span>
                                                </div>
                                                <div className="sizeandcolor">
                                                    <span>Size: S</span>
                                                    <span>Color: Orange</span>
                                                </div>
                                                <div className="remove">
                                                    <button title="Remove"><i className="ion-android-delete"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="cart-subtotals">
                                                <h5>Tổng tiền sản phẩm<span className="float-right">$698.00</span></h5>
                                                <h5>Phí ship<span className="float-right"> $7.00 </span></h5>
                                                <h5>VAT<span className="float-right">$0.00</span></h5>
                                                <h5>Tổng thanh toán<span className="float-right">$705.00</span></h5>
                                            </div>
                                        </li>
                                        <li className="shoping-cart-btn">
                                            <Link className="checkout-btn" to="/thanh-toan">Thanh toán</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="searchbox">
                            <form action="#">
                                <div className="search-form-input">
                                    <select id="select" name="select" className="nice-select">
                                        <option value="">Tất cả danh mục</option>
                                        <option value="12">Uncategorized</option>
                                        <option value="22">Electronics</option>
                                        <option value="26">Accessories</option>
                                        <option value="27">Cap HDMI</option>
                                        <option value="28">Headphone</option>
                                        <option value="29">Keyboard</option>
                                        <option value="23">Mouse</option>
                                        <option value="30">Laptops & Tablets</option>
                                        <option value="31">Laptop</option>
                                        <option value="31">Macbook</option>
                                        <option value="31">Smartphone</option>
                                        <option value="31">Tablets</option>
                                        <option value="32">Tvs & Audios</option>
                                        <option value="33">Amply</option>
                                        <option value="24">Smart TV</option>
                                        <option value="34">Speaker</option>
                                        <option value="35">TV</option>
                                        <option value="36">Fashion & Jewelry</option>
                                        <option value="37">Accessories</option>
                                        <option value="25">Rings</option>
                                        <option value="38">Watches</option>
                                    </select>
                                    <input type="text" placeholder="Nhập từ khóa sản phẩm ... "/>
                                    <button className="top-search-btn" type="submit">Tìm kiếm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}