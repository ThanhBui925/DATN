import { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { Skeleton } from "antd";
import { SingleProduct } from "../SingleProduct";
import { SingleProductList } from "../SingleProductList";
import { useSearchParams } from "react-router-dom";

interface Product {
    id: number;
    [key: string]: any;
}

interface ProductListProps {
    search: string;
}

export const ProductList = ({ search }: ProductListProps) => {
    const [recentTab, setRecentTab] = useState<"grid_view" | "list_view">("grid_view");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const productsPerPage = 9;

    const changeTab = (tab: "grid_view" | "list_view") => {
        setRecentTab(tab);
    };

    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: productsPerPage,
                search: search || undefined,
                category_id: searchParams.getAll("category_id").join(",") || undefined,
                size_id: searchParams.getAll("size_id").join(",") || undefined,
                color_id: searchParams.getAll("color_id").join(",") || undefined,
                price_min: searchParams.get("price_min") || undefined,
                price_max: searchParams.get("price_max") || undefined,
                sort: searchParams.get("sort") || "relevance",
            };

            const res = await axiosInstance.get<{
                data: Product[];
                meta?: { totalPages: number };
            }>("/api/client/products", { params });
            setProducts(res.data.data || []);
            setTotalPages(res.data.meta?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        searchParams.set("sort", e.target.value);
        setSearchParams(searchParams, { replace: true });
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage, search, searchParams]);

    const handlePageChange = (page: number) => {
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
                {Math.min(currentPage * productsPerPage, products.length)} của {products.length} sản phẩm
            </span>
                    </div>
                </div>
                <div className="product-select-box">
                    <div className="product-short">
                        <p>Sắp xếp theo:</p>
                        <select className="nice-select" onChange={handleSortChange} value={searchParams.get("sort") || "relevance"}>
                            <option value="relevance">Mức độ liên quan</option>
                            <option value="name_asc">Tên (A - Z)</option>
                            <option value="name_desc">Tên (Z - A)</option>
                            <option value="price_asc">Giá (Thấp &gt; Cao)</option>
                            <option value="price_desc">Giá (Cao &gt; Thấp)</option>
                            <option value="rating_asc">Đánh giá (Thấp nhất)</option>
                            <option value="rating_desc">Đánh giá (Cao nhất)</option>
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
                                        <Skeleton active />
                                    ) : products.length > 0 ? (
                                        products.map((product) => (
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
                                        products.map((product) => (
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