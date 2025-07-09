import {Sidebar} from "../components/shop/Sidebar";
import {ProductList} from "../components/shop/ProductList";
import {Breadcrumb} from "../components/Breadcrumb";

export const Shop = () => {
    const breadcrumb = {
        breadcrumb1: 'Trang chủ',
        breadcrumb2: 'Danh mục sản phẩm',
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mb-5">
                <div className="container-fluid">
                    <div className="row">
                        <Sidebar/>
                        <ProductList/>
                    </div>
                </div>
            </div>
        </>
    )
}