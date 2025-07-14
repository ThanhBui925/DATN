import { useLocation } from "react-router-dom";
import { Sidebar } from "../components/shop/Sidebar";
import { ProductList } from "../components/shop/ProductList";
import { Breadcrumb } from "../components/Breadcrumb";

export const Shop = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    const category = queryParams.get("category") || "";

    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Danh mục sản phẩm",
    };

    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <Sidebar />
                        <ProductList search={search} category={category} />
                    </div>
                </div>
            </div>
        </>
    );
};