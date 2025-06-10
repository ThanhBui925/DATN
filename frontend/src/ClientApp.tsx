import {Route, Routes} from "react-router";
import ClientLayout from "./layout/ClientLayout";
import {Home} from "./pages/home";
import {Login} from "./pages/admin/login";
import {Register} from "./pages/admin/register";
import {ForgotPassword} from "./pages/admin/forgotPassword";
import React from "react";

export const ClientApp = () => {
    return (
        <Routes>
            <Route
                path={`/`}
                element={
                    <ClientLayout />
                }
            >
                <Route path="home" element={<Home/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route
                    path="forgot-password"
                    element={<ForgotPassword/>}
                />
            </Route>
        </Routes>
    )
}