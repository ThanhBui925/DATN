import {SingleProduct} from "../SingleProduct";
import {SingleProductList} from "../SingleProductList";
import {useState} from "react";

export const ProductList = () => {
    const [recentTab, setRecentTab] = useState<string>('grid_view');

    const changeTab = (tab: string) => {
        setRecentTab(tab)
    }
    return (
        <div className="col-lg-9 order-1 order-lg-2">
            <div className="shop-top-bar mt-95">
                <div className="shop-bar-inner">
                    <div className="product-view-mode">
                        <ul className="nav shop-item-filter-list" role="tablist">
                            <li className="active" role="presentation">
                                <a onClick={() => {changeTab('grid_view')}} className={`${recentTab == 'grid_view' ? 'active' : ''}`}>
                                    <i className="fa fa-th"></i>
                                </a>
                            </li>
                            <li role="presentation">
                                <a onClick={() => {changeTab('list_view')}} className={`${recentTab == 'list_view' ? 'active' : ''}`}>
                                    <i className="fa fa-th-list"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="toolbar-amount">
                        <span>Showing 1 to 9 of 15</span>
                    </div>
                </div>
                <div className="product-select-box">
                    <div className="product-short">
                        <p>Sort By:</p>
                        <select className="nice-select">
                            <option value="trending">Relevance</option>
                            <option value="sales">Name (A - Z)</option>
                            <option value="sales">Name (Z - A)</option>
                            <option value="rating">Price (Low &gt; High)</option>
                            <option value="date">Rating (Lowest)</option>
                            <option value="price-asc">Model (A - Z)</option>
                            <option value="price-asc">Model (Z - A)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="shop-products-wrapper">
                <div className="tab-content">
                    {
                        recentTab === 'grid_view' ? (
                            <div id="grid-view" className="tab-pane fade active show" role="tabpanel">
                                <div className="shop-product-area">
                                    <div className="row">
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                        <div className="col-xl-3 col-lg-4 col-md-4 col-sm-6 mt-40">
                                            <SingleProduct/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div id="list-view" className="tab-pane fade active show" role="tabpanel">
                                <div className="row">
                                    <div className="col">
                                        <SingleProductList/>
                                        <SingleProductList/>
                                        <SingleProductList/>
                                        <SingleProductList/>
                                        <SingleProductList/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className="paginatoin-area">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <p>Showing 1-12 of 13 item(s)</p>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <ul className="pagination-box">
                                    <li><a href="#" className="Previous"><i className="fa fa-chevron-left"></i> Previous</a>
                                    </li>
                                    <li className="active"><a href="#">1</a></li>
                                    <li><a href="#">2</a></li>
                                    <li><a href="#">3</a></li>
                                    <li>
                                        <a href="#" className="Next"> Next <i className="fa fa-chevron-right"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}