import { useCallback, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { notification, Skeleton } from "antd";
import { useSearchParams } from "react-router-dom";
import { debounce } from "lodash";

interface Category {
    id: number;
    name: string;
}

interface Size {
    id: number;
    name: string;
}

interface Color {
    id: number;
    name: string;
}

export const Sidebar = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "");

    const debouncedUpdateSearch = useMemo(
        () =>
            debounce((value: string) => {
                const newParams = new URLSearchParams(searchParams);
                if (value) {
                    newParams.set("search", value);
                } else {
                    newParams.delete("search");
                }
                setSearchParams(newParams, { replace: true });
            }, 700),
        [searchParams, setSearchParams]
    );

    // Cleanup debounce on component unmount
    useEffect(() => {
        return () => {
            debouncedUpdateSearch.cancel();
        };
    }, [debouncedUpdateSearch]);

    const handleCategoryChange = useCallback(
        (id: number, checked: boolean) => {
            const current = searchParams.getAll("category_id").map(Number);
            const updated = checked ? [...new Set([...current, id])] : current.filter((catId) => catId !== id);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete("category_id");
            updated.forEach((catId) => newParams.append("category_id", String(catId)));
            setSearchParams(newParams, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const handleSizeChange = useCallback(
        (id: number, checked: boolean) => {
            const current = searchParams.getAll("size_id").map(Number);
            const updated = checked ? [...new Set([...current, id])] : current.filter((sizeId) => sizeId !== id);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete("size_id");
            updated.forEach((sizeId) => newParams.append("size_id", String(sizeId)));
            setSearchParams(newParams, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const handleColorChange = useCallback(
        (id: number, checked: boolean) => {
            const current = searchParams.getAll("color_id").map(Number);
            const updated = checked ? [...new Set([...current, id])] : current.filter((colorId) => colorId !== id);

            const newParams = new URLSearchParams(searchParams);
            newParams.delete("color_id");
            updated.forEach((colorId) => newParams.append("color_id", String(colorId)));
            setSearchParams(newParams, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedUpdateSearch(value);
        },
        [debouncedUpdateSearch]
    );

    const handleClearAll = useCallback(() => {
        setSearchTerm("");
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        newParams.delete("category_id");
        newParams.delete("size_id");
        newParams.delete("color_id");
        setSearchParams(newParams, { replace: true });
    }, [searchParams, setSearchParams]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                "/api/client/categories"
            );
            if (res.data.status) {
                setCategories(res.data.data);
            } else {
                notification.error({ message: res.data.message || "Không thể tải danh mục" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
    };

    const fetchSizes = async () => {
        try {
            const res = await axiosInstance.get(
                "/api/client/sizes"
            );
            if (res.data.status) {
                setSizes(res.data.data);
            } else {
                notification.error({ message: res.data.message || "Không thể tải kích cỡ" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        }
    };

    const fetchColors = async () => {
        try {
            const res = await axiosInstance.get(
                "/api/client/colors"
            );
            if (res.data.status) {
                setColors(res.data.data);
            } else {
                notification.error({ message: res.data.message || "Không thể tải màu sắc" });
            }
        } catch (e) {
            notification.error({ message: (e as Error).message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.all([fetchCategories(), fetchSizes(), fetchColors()]);
    }, []);

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    return (
        <div className="col-lg-3 order-2 order-lg-1">
            <div className="sidebar-categores-box">
                <div className="sidebar-title">
                    <h2>Bộ lọc</h2>
                </div>
                <button className="btn-clear-all" onClick={handleClearAll}>
                    Xóa tất cả
                </button>

                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Tìm kiếm sản phẩm</h5>
                    <div className="search-input">
                        <input
                            type="text"
                            className={`form-control`}
                            placeholder="Nhập tên sản phẩm"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo kích cỡ</h5>
                    <div className="size-checkbox">
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <ul>
                                {sizes.length > 0 ? (
                                    sizes.map((size) => {
                                        const isChecked = searchParams.getAll("size_id").includes(String(size.id));
                                        return (
                                            <li key={size.id}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => handleSizeChange(size.id, e.target.checked)}
                                                    />
                                                    <span style={{ marginLeft: "6px" }}>{size.name}</span>
                                                </label>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li>Chưa có kích cỡ nào!</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo màu sắc</h5>
                    <div className="color-categori">
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <ul>
                                {colors.length > 0 ? (
                                    colors.map((color) => {
                                        const isChecked = searchParams.getAll("color_id").includes(String(color.id));
                                        return (
                                            <li key={color.id}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => handleColorChange(color.id, e.target.checked)}
                                                    />
                                                    <span style={{ marginLeft: "6px" }}>{color.name}</span>
                                                </label>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li>Chưa có màu sắc nào!</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Lọc theo danh mục</h5>
                    <div className="categori-checkbox">
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <ul>
                                {categories.length > 0 ? (
                                    categories.map((category) => {
                                        const isChecked = searchParams.getAll("category_id").includes(String(category.id));
                                        return (
                                            <li key={category.id}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                                    />
                                                    <span style={{ marginLeft: "6px" }}>{category.name}</span>
                                                </label>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li>Chưa có danh mục nào!</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="shop-banner">
                <div className="single-banner">
                    <a href="#">
                        <img src="img/banner/shop-banner.jpg" alt="" />
                    </a>
                </div>
            </div>
        </div>
    );
};