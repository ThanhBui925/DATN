import {Sidebar} from "../components/shop/Sidebar";
import {ProductList} from "../components/shop/ProductList";
import {Breadcrumb} from "../components/Breadcrumb";
import {useEffect, useState} from "react";
import {axiosInstance} from "../utils/axios";
import {notification} from "antd";

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