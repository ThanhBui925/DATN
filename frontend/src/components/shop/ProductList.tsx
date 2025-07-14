import {useEffect, useState} from "react";
import {axiosInstance} from "../../utils/axios";
import {Skeleton} from "antd";
import {SingleProduct} from "../SingleProduct";
import {SingleProductList} from "../SingleProductList";
import emitter from "../../utils/eventBus";
import { useSearchParams } from "react-router-dom";


export const ProductList = ({search, category}: { search: any, category: any }) => {
    const [recentTab, setRecentTab] = useState("grid_view");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        priceMin: null,
        priceMax: null,
        sizes: [],
        colors: [],
        categories: [],
        sort: "trending",
    });
    const productsPerPage = 9;
    const [searchParams] = useSearchParams();

    const changeTab = (tab: string) => {
        setRecentTab(tab);
    };

    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: productsPerPage,
                search: search || undefined,
                category: category || undefined,
                price_min: filters.priceMin || undefined,
                price_max: filters.priceMax || undefined,
                size: filters.sizes.length > 0 ? filters.sizes.join(",") : undefined,
                color: filters.colors.length > 0 ? filters.colors.join(",") : undefined,
                categories:
                    filters.categories.length > 0 ? filters.categories.join(",") : undefined,
                sort: filters.sort || undefined,
            };

            const res = await axiosInstance.get("/api/client/products", {params});
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters((prev) => ({...prev, ...newFilters}));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSortChange = (e: any) => {
        setFilters((prev) => ({...prev, sort: e.target.value}));
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, search, category, filters, searchParams]);

    useEffect(() => {
        emitter.on("filterChange", handleFilterChange);
        return () => {
            emitter.off("filterChange", handleFilterChange);
        };
    }, []);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    return (
        <div className="col-lg-9 order-1 order-lg-2">
            <div className="shop-top-bar mt-95">
                <div className="shop-bar-inner">
                    <div className="product-view-mode">
                        <ul className="nav shop-item-filter-list" role="tablist">
                            <li className={recentTab === "grid_view" ? "active" : ""}>
                                <a onClick={() => changeTab("grid_view")}>
                                    <i className="fa fa-th"></i>
                                </a>
                            </li>
                            <li className={recentTab === "list_view" ? "active" : ""}>
                                <a onClick={() => changeTab("list_view")}>
                                    <i className="fa fa-th-list"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="toolbar-amount">
                        <span>
                            Hiển thị {(currentPage - 1) * productsPerPage + 1} đến{" "}
                            {Math.min(currentPage * productsPerPage, products.length)} của{" "}
                            {products.length} sản phẩm
                        </span>
                    </div>
                </div>
                <div className="product-select-box">
                    <div className="product-short">
                        <p>Sắp xếp theo:</p>
                        <select className="nice-select" onChange={handleSortChange} value={filters.sort}>
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
                    {recentTab === "grid_view" ? (
                        <div id="grid-view" className="tab-pane fade active show" role="tabpanel">
                            <div className="shop-product-area">
                                <div className="row">
                                    {loading ? (
                                        <Skeleton active/>
                                    ) : products.length > 0 ? (
                                        products.map((product: any) => (
                                            <div className="col-xl-3 col-lg-4 col-md-4 col-6 mt-40" key={product.id}>
                                                <SingleProduct product={product}/>
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
                                        <Skeleton active/>
                                    ) : products.length > 0 ? (
                                        products.map((product: any) => (
                                            <SingleProductList key={product.id} product={product}/>
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
                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                        <li key={page} className={currentPage === page ? "active" : ""}>
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