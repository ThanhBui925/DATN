import {Navigate, Route, Routes} from "react-router";
import ClientLayout from "./layout/ClientLayout";
import {Home} from "./pages/home";
import {Login} from "./pages/admin/login";
import {Register} from "./pages/admin/register";
import {ForgotPassword} from "./pages/admin/forgotPassword";
import React from "react";
import {DetailProductPage} from "./pages/detailProduct";

export const ClientApp = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<Navigate to="/trang-chu" replace />} />
                <Route path="trang-chu" element={<Home />} />
                <Route path="dang-nhap" element={<Login />} />
                <Route path="dang-ky" element={<Register />} />
                <Route path="quen-mat-khau" element={<ForgotPassword />} />

                <Route path="chi-tiet-san-pham/:id" element={<DetailProductPage />} />

            </Route>
        </Routes>
    )
}