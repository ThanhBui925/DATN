import {Authenticated} from "@refinedev/core";
import {ErrorComponent, ThemedLayoutV2, ThemedSiderV2} from "@refinedev/antd";
import {
    CatchAllNavigate,
    NavigateToResource,
} from "@refinedev/react-router";
import {Outlet, Route, Routes} from "react-router";
import {Header} from "./components/admin";
import Dashboard from "./pages/admin/dashboard/list";
import {OrdersList, OrdersShow} from "./pages/admin/orders";
import {CategoryCreate, CategoryEdit, CategoryList, CategoryShow} from "./pages/admin/categories";
import {BlogPostCreate, BlogPostEdit, BlogPostList, BlogPostShow} from "./pages/admin/blogs";
import {ProductsCreate, ProductsEdit, ProductsList, ProductsShow} from "./pages/admin/products";
import {ColorList} from "./pages/admin/colors/list";
import {SizeList} from "./pages/admin/sizes/list";
import {VoucherCreate, VoucherEdit, VoucherList, VoucherShow} from "./pages/admin/vouchers";
import {BannerCreate, BannerEdit, BannerList, BannerShow} from "./pages/admin/banners";
import {CustomerList, CustomerShow} from "./pages/admin/customers";
import {ReviewList, ReviewShow} from "./pages/admin/reviews";
import React from "react";
import {AdminList, AdminShow} from "./pages/admin/admins";
import {ManagerAdminCreate} from "./pages/admin/admins/create";
import {Link} from "react-router-dom";

export const AdminApp = () => {
    return (
        <Routes>
            <Route
                path={'/admin'}
                element={
                    <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/dang-nhap"/>}
                    >
                        <ThemedLayoutV2
                            Header={Header}
                            Sider={(props) => <ThemedSiderV2 {...props} Title={() => (
                                <Link to="/admin/dashboard">
                                    <img
                                        src="/img/logo/logo.png"
                                        alt="Logo"
                                        style={{ width: 150, height: 50 }}
                                    />
                                </Link>
                            )} fixed/>}
                        >
                            <Outlet/>
                        </ThemedLayoutV2>
                    </Authenticated>
                }
            >

                <Route path="/admin/dashboard">
                    <Route index element={<Dashboard/>}/>
                </Route>

                <Route path="/admin/orders">
                    <Route index element={<OrdersList/>}/>
                    <Route path="edit/:id" element={<CategoryEdit/>}/>
                    <Route path="show/:id" element={<OrdersShow/>}/>
                </Route>

                <Route
                    index
                    element={<NavigateToResource resource="blog_posts"/>}
                />

                <Route path="/admin/blogs">
                    <Route index element={<BlogPostList/>}/>
                    <Route path="create" element={<BlogPostCreate/>}/>
                    <Route path="edit/:id" element={<BlogPostEdit/>}/>
                    <Route path="show/:id" element={<BlogPostShow/>}/>
                </Route>

                <Route path="/admin/categories">
                    <Route index element={<CategoryList/>}/>
                    <Route path="create" element={<CategoryCreate/>}/>
                    <Route path="edit/:id" element={<CategoryEdit/>}/>
                    <Route path="show/:id" element={<CategoryShow/>}/>
                </Route>

                <Route path="/admin/products">
                    <Route index element={<ProductsList/>}/>
                    <Route path="create" element={<ProductsCreate/>}/>
                    <Route path="edit/:id" element={<ProductsEdit/>}/>
                    <Route path="show/:id" element={<ProductsShow/>}/>
                </Route>

                <Route path="/admin/colors">
                    <Route index element={<ColorList/>}/>
                </Route>
                {/* Màu sắc */}
                <Route path="/admin/sizes">
                    <Route index element={<SizeList/>}/>
                </Route>

                <Route path="/admin/vouchers">
                    <Route index element={<VoucherList/>}/>
                    <Route path="create" element={<VoucherCreate/>}/>
                    <Route path="edit/:id" element={<VoucherEdit/>}/>
                    <Route path="show/:id" element={<VoucherShow/>}/>
                </Route>

                <Route path="/admin/banners">
                    <Route index element={<BannerList/>}/>
                    <Route path="create" element={<BannerCreate/>}/>
                    <Route path="edit/:id" element={<BannerEdit/>}/>
                    <Route path="show/:id" element={<BannerShow/>}/>
                </Route>

                <Route path="/admin/customers">
                    <Route index element={<CustomerList/>}/>
                    <Route path="show/:id" element={<CustomerShow/>}/>
                </Route>

                <Route path="/admin/admins">
                    <Route index element={<AdminList/>}/>
                    <Route path="create" element={<ManagerAdminCreate/>}/>
                    <Route path="show/:id" element={<AdminShow/>}/>
                </Route>

                <Route path="/admin/reviews">
                    <Route index element={<ReviewList/>}/>
                    <Route path="show/:id" element={<ReviewShow/>}/>
                </Route>

                <Route path="*" element={<ErrorComponent/>}/>
            </Route>
        </Routes>

    )
}