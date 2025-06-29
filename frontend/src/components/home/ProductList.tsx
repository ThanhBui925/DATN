import {SingleProduct} from "../SingleProduct";
import {useEffect, useState} from "react";
import axios from "axios";
import {Skeleton} from "antd";

export const ProductList = () => {
    const [recentTab, setRecentTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');

    const changeTab = (tab: 'tab1' | 'tab2' | 'tab3') => {
        setRecentTab(tab);
    }
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/api/products");
                setProducts(res.data.data || res.data);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                                            <li role="presentation" className="active">
                                                <a onClick={() => {changeTab('tab1')}} className={`${recentTab == 'tab1' && 'active show'}`}>For men</a>
                                            </li>
                                            <li role="presentation">
                                                <a onClick={() => {changeTab('tab2')}} className={`${recentTab == 'tab2' && 'active show'}`}>For women</a>
                                            </li>
                                            <li role="presentation">
                                                <a onClick={() => {changeTab('tab3')}} className={`${recentTab == 'tab3' && 'active show'}`}>For kids </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="tab-content">
                                    {
                                        recentTab == 'tab1' && (
                                            <div id="for-men" className="tab-pane active show" role="tabpanel">
                                                <div className="row">
                                                    <div className="product-active-3 owl-carousel">
                                                        <div className="col">
                                                            {
                                                                loading ? (
                                                                    <Skeleton/>
                                                                ) : (
                                                                    products && products.length > 0 && (
                                                                        products.map((product) => (
                                                                            <SingleProduct product={product} />
                                                                        ))
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        recentTab == 'tab2' && (
                                            <div id="for-men" className="tab-pane active show" role="tabpanel">
                                                <div className="row">
                                                    <div className="product-active-3 owl-carousel">
                                                        <div className="col">
                                                            {
                                                                loading ? (
                                                                    <Skeleton/>
                                                                ) : (
                                                                    products && products.length > 0 && (
                                                                        products.map((product) => (
                                                                            <SingleProduct product={product} />
                                                                        ))
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        recentTab == 'tab3' && (
                                            <div id="for-men" className="tab-pane active show" role="tabpanel">
                                                <div className="row">
                                                    <div className="product-active-3 owl-carousel">
                                                        <div className="col">
                                                            {
                                                                loading ? (
                                                                    <Skeleton/>
                                                                ) : (
                                                                    products && products.length > 0 && (
                                                                        products.map((product) => (
                                                                            <SingleProduct product={product} />
                                                                        ))
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="single-banner-box">
                            <a href="#"><img src="/img/banner/8.jpg" alt=""/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}