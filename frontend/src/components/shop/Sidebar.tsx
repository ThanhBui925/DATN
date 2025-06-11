export const Sidebar = () => {
    return (
        <div className="col-lg-3 order-2 order-lg-1">
            <div className="sidebar-categores-box mt-95">
                <div className="sidebar-title">
                    <h2>For men</h2>
                </div>
                <div className="category-sub-menu">
                    <ul>
                        <li className="has-sub"><a href="# ">Jackets</a>
                            <ul>
                                <li><a href="#">Florals</a></li>
                                <li><a href="#">Shirts</a></li>
                                <li><a href="#">Shorts</a></li>
                                <li><a href="#">Stripes</a></li>
                            </ul>
                        </li>
                        <li className="has-sub"><a href="#">Jeans</a>
                            <ul>
                                <li><a href="#">Hoodies</a></li>
                                <li><a href="#">Sweaters</a></li>
                                <li><a href="#">Vests</a></li>
                                <li><a href="#">Wedges</a></li>
                            </ul>
                        </li>
                        <li className="has-sub"><a href="#">Men</a>
                            <ul>
                                <li><a href="#">Crochet</a></li>
                                <li><a href="#">Dresses</a></li>
                                <li><a href="#"> Jeans</a></li>
                                <li><a href="#">Trousers</a></li>
                            </ul>
                        </li>
                        <li className="has-sub"><a href="#">Women</a>
                            <ul>
                                <li><a href="#">Casual</a></li>
                                <li><a href="#">Chinos</a></li>
                                <li><a href="#">Joggers</a></li>
                                <li><a href="#">Tailored</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="sidebar-categores-box">
                <div className="sidebar-title">
                    <h2>Filter By</h2>
                </div>
                <button className="btn-clear-all">Clear all</button>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Price</h5>
                    <div className="price-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="radio" name="price-filter"/><a href="#">$10.00 - $11.00
                                    (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$14.00 - $15.00 (2)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$16.00 - $17.00 (2)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#">$18.00 - $19.00 (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $24.00 - $28.00 (5)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $30.00 - $32.00 (1)</a></li>
                                <li><input type="radio" name="price-filter"/><a href="#"> $50.00 - $53.00 (2) </a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Size</h5>
                    <div className="size-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-size"/><a href="#">S (1)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">M (4)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">L (2)</a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Color</h5>
                    <div className="color-categoriy">
                        <form action="#">
                            <ul>
                                <li><span className="white"></span><a href="#">White (1)</a></li>
                                <li><span className="black"></span><a href="#">Black (1)</a></li>
                                <li><span className="Orange"></span><a href="#">Orange (3) </a></li>
                                <li><span className="Blue"></span><a href="#">Blue (2) </a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Compositions</h5>
                    <div className="categori-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Cotton (5)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Polyester (4)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Viscose (4)</a></li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>

            <div className="shop-banner">
                <div className="single-banner">
                    <a href="#"><img src="img/banner/shop-banner.jpg" alt=""/></a>
                </div>
            </div>
        </div>
    )
}