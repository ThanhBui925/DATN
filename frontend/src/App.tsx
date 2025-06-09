import {Authenticated, Refine} from "@refinedev/core";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";


import {
    ErrorComponent,
    ThemedLayoutV2,
    ThemedSiderV2,
    useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
    CatchAllNavigate,
    DocumentTitleHandler,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router";
import dataProvider from "./providers/Provider";
import {App as AntdApp} from "antd";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import {authProvider} from "./authProvider";
import {Header} from "./components/header";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {
    BlogPostCreate,
    BlogPostEdit,
    BlogPostList,
    BlogPostShow,
} from "./pages/blogs";
import {
    CategoryCreate,
    CategoryEdit,
    CategoryList,
    CategoryShow,
} from "./pages/categories";
import {ForgotPassword} from "./pages/forgotPassword";
import {Login} from "./pages/login";
import {Register} from "./pages/register";
import {ProductsCreate, ProductsEdit, ProductsList, ProductsShow} from "./pages/products";
import {ColorList} from "./pages/colors/list";
import React from "react";
import {SizeList} from "./pages/sizes/list";
import {
    VoucherList,
    VoucherCreate,
    VoucherEdit,
    VoucherShow
} from "./pages/vouchers";
import {
    BannerCreate,
    BannerEdit,
    BannerList,
    BannerShow,
} from "./pages/banners";
import {
    BgColorsOutlined,
    DashboardOutlined, ExpandOutlined, FileTextOutlined, GiftOutlined, PictureOutlined, ShoppingCartOutlined,
    ShoppingOutlined, SolutionOutlined,
    UnorderedListOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    CustomerList, CustomerShow
} from "./pages/customers";
import Dashboard from "./pages/dashboard/list";
import {OrdersList, OrdersShow} from "./pages/orders";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <AntdApp>
                        <DevtoolsProvider>
                            <Refine
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                dataProvider={dataProvider}
                                notificationProvider={useNotificationProvider}
                                routerProvider={routerBindings}
                                authProvider={authProvider}
                                resources={[
                                    {
                                        name: "dashboard",
                                        list: "/dashboard",
                                        meta: {
                                            label: "Bảng điều khiển",
                                            icon: <DashboardOutlined/>,
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "orders",
                                        list: "/orders",
                                        edit: "/orders/edit/:id",
                                        show: "/orders/show/:id",
                                        meta: {
                                            label: "Quản lý đơn hàng",
                                            icon: <ShoppingCartOutlined/>,
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "categories",
                                        list: "/categories",
                                        create: "/categories/create",
                                        edit: "/categories/edit/:id",
                                        show: "/categories/show/:id",
                                        meta: {
                                            label: "Danh mục",
                                            icon: <UnorderedListOutlined/>,
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "products",
                                        list: "/products",
                                        create: "/products/create",
                                        edit: "/products/edit/:id",
                                        show: "/products/show/:id",
                                        meta: {
                                            label: "Sản phẩm",
                                            icon: <ShoppingOutlined/>,
                                            canDelete: true,
                                        },
                                    },
                                    {
                                        name: "colors",
                                        list: "/colors",
                                        create: "/colors/create",
                                        edit: "/colors/edit/:id",
                                        show: "/colors/show/:id",
                                        meta: {
                                            label: "Quản lý màu sắc",
                                            icon: <BgColorsOutlined/>,
                                            canDelete: true,
                                        },
                                    },
                                    // màu sắc
                                    {
                                        name: "sizes",
                                        list: "/sizes",
                                        create: "/sizes/create",
                                        edit: "/sizes/edit/:id",
                                        show: "/sizes/show/:id",
                                        meta: {
                                            label: "Quản lý kích cỡ",
                                            icon: <ExpandOutlined/>,
                                            canDelete: true,
                                        },
                                    },

                                    {
                                        name: "blogs",
                                        list: "/blogs",
                                        create: "/blogs/create",
                                        edit: "/blogs/edit/:id",
                                        show: "/blogs/show/:id",
                                        meta: {
                                            label: "Quản lý bài viết",
                                            icon: <FileTextOutlined/>,
                                            canDelete: true,
                                        },
                                    },

                                    {
                                        name: "vouchers",
                                        list: "/vouchers",
                                        create: "/vouchers/create",
                                        edit: "/vouchers/edit/:id",
                                        show: "/vouchers/show/:id",
                                        meta: {
                                            label: "Quản lý voucher",
                                            icon: <GiftOutlined/>,
                                            canDelete: true,
                                        },
                                    },

                                    {
                                        name: "banners",
                                        list: "/banners",
                                        create: "/banners/create",
                                        edit: "/banners/edit/:id",
                                        show: "/banners/show/:id",
                                        meta: {
                                            label: "Quản lý banner",
                                            icon: <PictureOutlined />,
                                            canDelete: true,
                                        },
                                    },

                                    {
                                        name: "customers",
                                        list: "/customers",
                                        show: "/customers/show/:id",
                                        meta: {
                                            label: "Quản lý khách hàng",
                                            icon: <UserOutlined />,
                                            canDelete: true,
                                        },
                                    },
                                ]}
                                options={{
                                    syncWithLocation: true,
                                    warnWhenUnsavedChanges: true,
                                    useNewQueryKeys: true,
                                    projectId: "nOHMEU-KEmr3X-YmSY47",
                                }}
                            >
                                <Routes>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-inner"
                                                fallback={<CatchAllNavigate to="/login"/>}
                                            >
                                                <ThemedLayoutV2
                                                    Header={Header}
                                                    Sider={(props) => <ThemedSiderV2 {...props} fixed/>}
                                                >
                                                    <Outlet/>
                                                </ThemedLayoutV2>
                                            </Authenticated>
                                        }
                                    >

                                        <Route path="/dashboard">
                                            <Route index element={<Dashboard/>}/>
                                        </Route>

                                        <Route path="/orders">
                                            <Route index element={<OrdersList/>}/>
                                            <Route path="edit/:id" element={<CategoryEdit/>}/>
                                            <Route path="show/:id" element={<OrdersShow/>}/>
                                        </Route>

                                        <Route
                                            index
                                            element={<NavigateToResource resource="blog_posts"/>}
                                        />

                                        <Route path="/blogs">
                                            <Route index element={<BlogPostList/>}/>
                                            <Route path="create" element={<BlogPostCreate/>}/>
                                            <Route path="edit/:id" element={<BlogPostEdit/>}/>
                                            <Route path="show/:id" element={<BlogPostShow/>}/>
                                        </Route>

                                        <Route path="/categories">
                                            <Route index element={<CategoryList/>}/>
                                            <Route path="create" element={<CategoryCreate/>}/>
                                            <Route path="edit/:id" element={<CategoryEdit/>}/>
                                            <Route path="show/:id" element={<CategoryShow/>}/>
                                        </Route>

                                        <Route path="/products">
                                            <Route index element={<ProductsList/>}/>
                                            <Route path="create" element={<ProductsCreate/>}/>
                                            <Route path="edit/:id" element={<ProductsEdit/>}/>
                                            <Route path="show/:id" element={<ProductsShow/>}/>
                                        </Route>

                                        <Route path="/colors">
                                            <Route index element={<ColorList/>}/>
                                        </Route>
                                        {/* Màu sắc */}
                                        <Route path="/sizes">
                                            <Route index element={<SizeList/>}/>
                                        </Route>

                                        <Route path="/vouchers">
                                            <Route index element={<VoucherList/>}/>
                                            <Route path="create" element={<VoucherCreate/>}/>
                                            <Route path="edit/:id" element={<VoucherEdit/>}/>
                                            <Route path="show/:id" element={<VoucherShow/>}/>
                                        </Route>

                                        <Route path="/banners">
                                            <Route index element={<BannerList/>}/>
                                            <Route path="create" element={<BannerCreate/>}/>
                                            <Route path="edit/:id" element={<BannerEdit/>}/>
                                            <Route path="show/:id" element={<BannerShow/>}/>
                                        </Route>

                                        <Route path="/customers">
                                            <Route index element={<CustomerList/>}/>
                                            <Route path="show/:id" element={<CustomerShow/>}/>
                                        </Route>

                                        <Route path="*" element={<ErrorComponent/>}/>
                                    </Route>
                                    <Route
                                        element={
                                            <Authenticated
                                                key="authenticated-outer"
                                                fallback={<Outlet/>}
                                            >
                                                <NavigateToResource/>
                                            </Authenticated>
                                        }
                                    >
                                        <Route path="/login" element={<Login/>}/>
                                        <Route path="/register" element={<Register/>}/>
                                        <Route
                                            path="/forgot-password"
                                            element={<ForgotPassword/>}
                                        />
                                    </Route>
                                </Routes>

                                <RefineKbar/>
                                <UnsavedChangesNotifier/>
                                <DocumentTitleHandler/>
                            </Refine>
                            <DevtoolsPanel/>
                        </DevtoolsProvider>
                    </AntdApp>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;