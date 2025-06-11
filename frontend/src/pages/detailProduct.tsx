import {DetailProduct} from "../components/DetailProduct";
import {Breadcrumb} from "../components/Breadcrumb";
export const DetailProductPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Chi tiết sản phẩm",
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container-fluid">
                    <DetailProduct/>
                </div>
            </div>
        </>
    )
}