import {SingleProduct} from "../SingleProduct";
import {useEffect, useState} from "react";
import axios from "axios";
import {Skeleton} from "antd";

export const ProductList = () => {
    const [recentTab, setRecentTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');
    const [forMan, setForMan] = useState([]);
    const [forGirl, setForGirl] = useState([]);
    const [forChildren, setForChildren] = useState([]);
    const [loading, setLoading] = useState(false);

    const changeTab = (tab: 'tab1' | 'tab2' | 'tab3') => {
        setRecentTab(tab);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(import.meta.env.VITE_APP_API_URL + '/api/client/products');
            const data = res.data.data || {};
            setForMan(data.forMan || []);
            setForGirl(data.forGirl || []);
            setForChildren(data.forChildren || []);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                                    <h2>Sản phẩm</h2>
                                    <div className="product-tabs-list-2">
                                        <ul className="nav">
                                            <li>
                                                <a className={recentTab === 'tab1' ? 'text-original-base' : ''}
                                                   onClick={() => changeTab('tab1')}>Cho nam</a>
                                            </li>
                                            <li>
                                                <a className={recentTab === 'tab2' ? 'text-original-base' : ''}
                                                   onClick={() => changeTab('tab2')}>Cho nữ</a>
                                            </li>
                                            <li>
                                                <a className={recentTab === 'tab3' ? 'text-original-base' : ''}
                                                   onClick={() => changeTab('tab3')}>Cho trẻ</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="tab-content">
                                    {recentTab === 'tab1' && (
                                        <div id="for-men" className="tab-pane active show" role="tabpanel">
                                            <div className="row">
                                                {loading ? (
                                                    <div className="col-12">
                                                        <Skeleton/>
                                                    </div>
                                                ) : (
                                                    forMan && forMan.length > 0 ? (
                                                        forMan.slice(0, 4).map((product: any) => (
                                                            <div className="col-6 col-sm-6 col-md-3 mb-4"
                                                                 key={product.id}>
                                                                <SingleProduct product={product}/>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="">Không có sản phẩm</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {recentTab === 'tab2' && (
                                        <div id="for-men" className="tab-pane active show" role="tabpanel">
                                            <div className="row">
                                                {loading ? (
                                                    <div className="col-12">
                                                        <Skeleton/>
                                                    </div>
                                                ) : (
                                                    forGirl && forGirl.length > 0 ? (
                                                        forGirl.slice(0, 4).map((product: any) => (
                                                            <div className="col-6 col-sm-6 col-md-3 mb-4"
                                                                 key={product.id}>
                                                                <SingleProduct product={product}/>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="">Không có sản phẩm</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {recentTab === 'tab3' && (
                                        <div id="for-men" className="tab-pane active show" role="tabpanel">
                                            <div className="row">
                                                {loading ? (
                                                    <div className="col-12">
                                                        <Skeleton/>
                                                    </div>
                                                ) : (
                                                    forChildren && forChildren.length > 0 ? (
                                                        forChildren.slice(0, 4).map((product: any) => (
                                                            <div className="col-6 col-sm-6 col-md-3 mb-4"
                                                                 key={product.id}>
                                                                <SingleProduct product={product}/>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="">Không có sản phẩm</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
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
    );
};