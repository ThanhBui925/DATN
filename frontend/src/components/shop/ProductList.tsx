import { SingleProduct } from "../SingleProduct";
import { SingleProductList } from "../SingleProductList";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "antd";

export const ProductList = () => {
    const [recentTab, setRecentTab] = useState<string>('grid_view');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 9;

    const changeTab = (tab: string) => {
        setRecentTab(tab);
    };

    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/client/products`, {
                params: {
                    page,
                    limit: productsPerPage,
                },
            });
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                        <span>Hiển thị {(currentPage - 1) * productsPerPage + 1} đến {Math.min(currentPage * productsPerPage, products.length)} của {products.length} sản phẩm</span>
                    </div>
                </div>
                <div className="product-select-box">
                    <div className="product-short">
                        <p>Sắp xếp theo:</p>
                        <select className="nice-select">
                            <option value="trending">Mức độ liên quan</option>
                            <option value="sales">Tên (A - Z)</option>
                            <option value="sales">Tên (Z - A)</option>
                            <option value="rating">Giá (Thấp &gt; Cao)</option>
                            <option value="date">Đánh giá (Thấp nhất)</option>
                            <option value="price-asc">Mẫu (A - Z)</option>
                            <option value="price-asc">Mẫu (Z - A)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="shop-products-wrapper">
                <div className="tab-content">
                    {recentTab === 'grid_view' ? (
                        <div id="grid-view" className="tab-pane fade active show" role="tabpanel">
                            <div className="shop-product-area">
                                <div className="row">
                                    {loading ? (
                                        <Skeleton active />
                                    ) : products.length > 0 ? (
                                        products.map((product: any) => (
                                            <div className="col-xl-3 col-lg-4 col-md-4 col-6 mt-40" key={product.id}>
                                                <SingleProduct product={product} />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có sản phẩm nào.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id="list-view" className="tab-pane fade active show" role="tabpanel">
                            <div className="row">
                                <div className="col">
                                    {loading ? (
                                        <Skeleton active />
                                    ) : products.length > 0 ? (
                                        products.map((product: any) => (
                                            <SingleProductList key={product.id} product={product} />
                                        ))
                                    ) : (
                                        <p>Không có sản phẩm nào.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="paginatoin-area">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <p>Hiển thị {products.length} sản phẩm</p>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <ul className="pagination-box">
                                    <li>
                                        <a
                                            href="#"
                                            className="Previous"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                            }}
                                        >
                                            <i className="fa fa-chevron-left"></i> Trước
                                        </a>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <li key={page} className={currentPage === page ? 'active' : ''}>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page);
                                                }}
                                            >
                                                {page}
                                            </a>
                                        </li>
                                    ))}
                                    <li>
                                        <a
                                            href="#"
                                            className="Next"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                            }}
                                        >
                                            Tiếp <i className="fa fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};