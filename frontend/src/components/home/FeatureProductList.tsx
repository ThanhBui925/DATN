import {SingleProduct} from "../SingleProduct";
import {useEffect, useState} from "react";
import axios from "axios";
import {Skeleton} from "antd";

export const FeatureProductList = () => {
    const [bestSellerProduct, setBestSellerProduct] = useState([]);
    const [featureProducts, setFeatureProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBestSeller = async () => {
        setLoading(true);
        try {
            const res = await axios.get(import.meta.env.VITE_APP_API_URL + '/api/client/best-seller-product');
            setBestSellerProduct(res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeatureProduct = async () => {
        setLoading(true);
        try {
            const res = await axios.get(import.meta.env.VITE_APP_API_URL + '/api/client/feature-product');
            setFeatureProducts(res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBestSeller();
    }, []);
    return (
        <div className="product-area pt-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title">
                            <div className="product-tabs-list">
                                <ul role="tablist" className="nav">
                                    <li className="active" role="presentation">
                                        <a data-bs-toggle="tab"
                                            onClick={fetchBestSeller}
                                            role="tab"
                                            className={`active show`}
                                            aria-controls="best-sellers"
                                            aria-selected="true"
                                            href="#best-sellers">
                                            Bán chạy nhất
                                        </a>
                                    </li>
                                    <li role="presentation">
                                        <a data-bs-toggle="tab"
                                            onClick={fetchFeatureProduct}
                                            role="tab"
                                            aria-controls="on-sellers" href="#on-sellers">
                                            Sản phẩm nổi bật
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="section-title-dic">
                            <p>Cửa hàng của chúng tôi không chỉ là một nhà bán lẻ trực tuyến trung bình. Chúng tôi không
                                chỉ bán các sản phẩm chất lượng hàng đầu mà còn mang đến cho khách hàng trải nghiệm mua
                                sắm trực tuyến tích cực.</p>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <div id="best-sellers" className="tab-pane active show" role="tabpanel">
                        <div className="row">
                            {
                                loading ? (
                                    <div className="col-12">
                                        <Skeleton/>
                                    </div>
                                ) : (
                                    bestSellerProduct && bestSellerProduct.length > 0 && (
                                        bestSellerProduct.slice(0,4).map((product: any) => (
                                            <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                                                <SingleProduct product={product}/>
                                            </div>
                                        ))
                                    )
                                )
                            }
                        </div>
                    </div>
                    <div id="on-sellers" className="tab-pane" role="tabpanel">
                        <div className="row">
                            {
                                loading ? (
                                    <div className="col-12">
                                        <Skeleton/>
                                    </div>
                                ) : (
                                    featureProducts && featureProducts.length > 0 && (
                                        featureProducts.slice(0,4).map((product: any) => (
                                            <div className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                                                <SingleProduct product={product}/>
                                            </div>
                                        ))
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}