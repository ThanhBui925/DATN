import {SingleProduct} from "../SingleProduct";

export const ProductList = () => {
    return (
        <div className="product-area pb-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-9">
                        <div className="row">
                            <div className="col">
                                <div className="section-title-3">
                                    <h2>For men</h2>
                                    <div className="product-tabs-list-2">
                                        <ul className="nav" role="tablist">
                                            <li role="presentation" className="active"><a aria-selected="true" className="active show" href="#for-men" aria-controls="for-men" role="tab" data-bs-toggle="tab">For men</a></li>
                                            <li role="presentation"><a href="#for-women" aria-controls="for-women" role="tab" data-bs-toggle="tab">For women</a></li>
                                            <li role="presentation"><a href="#for-kids" aria-controls="for-kids" role="tab" data-bs-toggle="tab">For kids </a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="tab-content">
                                    <div id="for-men" className="tab-pane active show" role="tabpanel">
                                        <div className="row">
                                            <div className="product-active-3 owl-carousel">
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="for-women" className="tab-pane" role="tabpanel">
                                        <div className="row">
                                            <div className="product-active-3 owl-carousel">
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="for-kids" className="tab-pane" role="tabpanel">
                                        <div className="row">
                                            <div className="product-active-3 owl-carousel">
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                                <div className="col">
                                                    <SingleProduct />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="single-banner-box">
                            <a href="#"><img src="/img/banner/8.jpg" alt="" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}