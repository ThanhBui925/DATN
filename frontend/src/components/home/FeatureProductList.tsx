import {SingleProduct} from "../SingleProduct";
import {useEffect, useState} from "react";
import axios from "axios";
import {Skeleton} from "antd";

export const FeatureProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(import.meta.env.VITE_APP_API_URL + '/api/client/products');
                setProducts(res.data.data || []);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    return (
        <div className="product-area pt-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <div className="product-tabs-list">
                                <ul role="tablist" className="nav">
                                    <li className="active" role="presentation"><a data-bs-toggle="tab" role="tab"
                                                                                  aria-controls="new-arrivals"
                                                                                  href="#new-arrivals"
                                                                                  className="active show"
                                                                                  aria-selected="true">New Arrival</a>
                                    </li>
                                    <li role="presentation"><a data-bs-toggle="tab" role="tab"
                                                               aria-controls="best-sellers"
                                                               href="#best-sellers">Bestseller</a></li>
                                    <li role="presentation"><a data-bs-toggle="tab" role="tab"
                                                               aria-controls="on-sellers" href="#on-sellers"> Featured
                                        Products</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="section-title-dic">
                            <p>Our store is more than just another average online retailer. We sell not only top quality
                                products, but give our customers a positive online shopping experience.</p>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <div id="new-arrivals" className="tab-pane active show" role="tabpanel">
                        <div className="row">
                            <div className="product-active owl-carousel">
                                <div className="col">
                                    {
                                        loading ? (
                                            <Skeleton/>
                                        ) : (
                                            products && products.length > 0 && (
                                                products.map((product) => (
                                                    <SingleProduct product={product}/>
                                                ))
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div id="best-sellers" className="tab-pane" role="tabpanel">*/}
                    {/*    <div className="row">*/}
                    {/*        <div className="product-active owl-carousel">*/}
                    {/*            {*/}
                    {/*                loading ? (*/}
                    {/*                    <Skeleton/>*/}
                    {/*                ) : (*/}
                    {/*                    products && products.length > 0 && (*/}
                    {/*                        products.map((product) => (*/}
                    {/*                            <div className="col">*/}
                    {/*                                <SingleProduct product={product}/>*/}
                    {/*                            </div>*/}
                    {/*                        ))*/}
                    {/*                    )*/}
                    {/*                )*/}
                    {/*            }*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div id="on-sellers" className="tab-pane" role="tabpanel">*/}
                    {/*    <div className="row">*/}
                    {/*        <div className="product-active owl-carousel">*/}
                    {/*            {*/}
                    {/*                loading ? (*/}
                    {/*                    <Skeleton/>*/}
                    {/*                ) : (*/}
                    {/*                    products && products.length > 0 && (*/}
                    {/*                        products.map((product) => (*/}
                    {/*                            <div className="col">*/}
                    {/*                                <SingleProduct product={product}/>*/}
                    {/*                            </div>*/}
                    {/*                        ))*/}
                    {/*                    )*/}
                    {/*                )*/}
                    {/*            }*/}

                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}