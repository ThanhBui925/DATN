import {Navigate, Route, Routes} from "react-router";
import ClientLayout from "./layout/ClientLayout";
import {Home} from "./pages/home";
import {ForgotPassword} from "./pages/admin/forgotPassword";
import React from "react";
import {DetailProductPage} from "./pages/detailProduct";
import {ListBlogPage} from "./pages/listBlog";
import {DetailBlogPage} from "./pages/detailBlog";
import {ContactPage} from "./pages/contact";
import {AboutUsPage} from "./pages/aboutUs";
import {Shop} from "./pages/shop";
import {Cart} from "./pages/cart";
import ClientLayout2 from "./layout/ClientLayout2";
import {Checkout} from "./pages/checkout";
import {Login} from "./pages/auth/login";
import AuthLayout from "./layout/AuthLayout";
import {Register} from "./pages/auth/register";
import {Profile} from "./pages/auth/profile";
import {Order} from "./pages/order";
import {OrderDetail} from "./pages/orderDetail";
import {Address} from "./pages/auth/address";
import {ReturnOrderInstruct} from "./pages/returnOrderInstruct";
import {SalesPolicy} from "./pages/salePolicy";
import {OrderInstruct} from "./pages/orderInstruct";
import {CompanionBrand} from "./pages/companionBrand";

export const ClientApp = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<Navigate to="/trang-chu" replace />} />
                <Route path="trang-chu" element={<Home />} />

                <Route path="chi-tiet-san-pham/:id" element={<DetailProductPage />} />
                
                <Route path="bai-viet" element={<ListBlogPage />} />
                <Route path="chi-tiet-bai-viet/:id" element={<DetailBlogPage />} />
                <Route path="chi-tiet-bai-viet/:id" element={<DetailBlogPage />} />

                <Route path="lien-he" element={<ContactPage />} />
                <Route path="ve-chung-toi" element={<AboutUsPage />} />
                <Route path="huong-dan-hoan-hang" element={<ReturnOrderInstruct />} />
                <Route path="chinh-sach-ban-hang" element={<SalesPolicy />} />
                <Route path="huong-dan-mua-hang" element={<OrderInstruct />} />
                <Route path="thuong-hieu-dong-hanh" element={<CompanionBrand />} />

                <Route path="danh-muc-san-pham" element={<Shop />} />
                <Route path="tai-khoan-cua-toi" element={<Profile />} />
                <Route path="dia-chi" element={<Address />} />
                <Route path="don-hang-cua-toi" element={<Order />} />
                <Route path="chi-tiet-don-hang/:orderId" element={<OrderDetail />} />
            </Route>
            <Route path="/" element={<ClientLayout2 />}>
                <Route path="gio-hang" element={<Cart />} />
                <Route path="thanh-toan" element={<Checkout />} />
            </Route>

            <Route path="/" element={<AuthLayout />}>
                <Route path="dang-nhap" element={<Login/>} />
                <Route path="dang-ky" element={<Register />} />
                <Route path="quen-mat-khau" element={<ForgotPassword />} />
            </Route>
        </Routes>
    )
}