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

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <AntdApp>
                        <DevtoolsProvider>
                            <Refine
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
