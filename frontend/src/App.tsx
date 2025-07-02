import "@refinedev/antd/dist/reset.css";

import {BrowserRouter} from "react-router";
import React from "react";
import {AdminApp} from "./AdminApp";
import {ClientApp} from "./ClientApp";
import routerBindings, {DocumentTitleHandler, UnsavedChangesNotifier} from "@refinedev/react-router";
import {authProvider} from "./providers/authProvider";
import {
    BgColorsOutlined,
    DashboardOutlined, ExpandOutlined, FileTextOutlined, GiftOutlined, PictureOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined, StarOutlined,
    UnorderedListOutlined, UserOutlined
} from "@ant-design/icons";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import {ColorModeContextProvider} from "./contexts/color-mode";
import {App as AntdApp} from "antd";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import dataProvider from "./providers/Provider";
import {Refine} from "@refinedev/core";
import {notificationProvider} from "./providers/notificationProvider";
import {i18nProvider} from "./providers/i18nProvider";
import {HelmetProvider} from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <RefineKbarProvider>
                    <ColorModeContextProvider>
                        <AntdApp>
                            <DevtoolsProvider>
                                <Refine
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    dataProvider={dataProvider}
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    notificationProvider={notificationProvider}
                                    routerProvider={routerBindings}
                                    authProvider={authProvider}
                                    i18nProvider={i18nProvider}
                                    resources={[
                                        {
                                            name: "dashboard",
                                            list: "/admin/dashboard",
                                            meta: {
                                                label: "Bảng điều khiển",
                                                icon: <DashboardOutlined/>,
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "orders",
                                            list: "/admin/orders",
                                            edit: "/admin/orders/edit/:id",
                                            show: "/admin/orders/show/:id",
                                            meta: {
                                                label: "Quản lý đơn hàng",
                                                icon: <ShoppingCartOutlined/>,
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "categories",
                                            list: "/admin/categories",
                                            create: "/admin/categories/create",
                                            edit: "/admin/categories/edit/:id",
                                            show: "/admin/categories/show/:id",
                                            meta: {
                                                label: "Danh mục",
                                                icon: <UnorderedListOutlined/>,
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "products",
                                            list: "/admin/products",
                                            create: "/admin/products/create",
                                            edit: "/admin/products/edit/:id",
                                            show: "/admin/products/show/:id",
                                            meta: {
                                                label: "Sản phẩm",
                                                icon: <ShoppingOutlined/>,
                                                canDelete: true,
                                            },
                                        },
                                        {
                                            name: "colors",
                                            list: "/admin/colors",
                                            create: "/admin/colors/create",
                                            edit: "/admin/colors/edit/:id",
                                            show: "/admin/colors/show/:id",
                                            meta: {
                                                label: "Quản lý màu sắc",
                                                icon: <BgColorsOutlined/>,
                                                canDelete: true,
                                            },
                                        },
                                        // màu sắc
                                        {
                                            name: "sizes",
                                            list: "/admin/sizes",
                                            create: "/admin/sizes/create",
                                            edit: "/admin/sizes/edit/:id",
                                            show: "/admin/sizes/show/:id",
                                            meta: {
                                                label: "Quản lý kích cỡ",
                                                icon: <ExpandOutlined/>,
                                                canDelete: true,
                                            },
                                        },

                                        {
                                            name: "blogs",
                                            list: "/admin/blogs",
                                            create: "/admin/blogs/create",
                                            edit: "/admin/blogs/edit/:id",
                                            show: "/admin/blogs/show/:id",
                                            meta: {
                                                label: "Quản lý bài viết",
                                                icon: <FileTextOutlined/>,
                                                canDelete: true,
                                            },
                                        },

                                        {
                                            name: "vouchers",
                                            list: "/admin/vouchers",
                                            create: "/admin/vouchers/create",
                                            edit: "/admin/vouchers/edit/:id",
                                            show: "/admin/vouchers/show/:id",
                                            meta: {
                                                label: "Quản lý voucher",
                                                icon: <GiftOutlined/>,
                                                canDelete: true,
                                            },
                                        },

                                        {
                                            name: "banners",
                                            list: "/admin/banners",
                                            create: "/admin/banners/create",
                                            edit: "/admin/banners/edit/:id",
                                            show: "/admin/banners/show/:id",
                                            meta: {
                                                label: "Quản lý banner",
                                                icon: <PictureOutlined/>,
                                                canDelete: true,
                                            },
                                        },

                                        {
                                            name: "customers",
                                            list: "/admin/customers",
                                            show: "/admin/customers/show/:id",
                                            meta: {
                                                label: "Quản lý khách hàng",
                                                icon: <UserOutlined/>,
                                                canDelete: true,
                                            },
                                        },

                                        {
                                            name: "reviews",
                                            list: "/admin/reviews",
                                            show: "/admin/reviews/show/:id",
                                            meta: {
                                                label: "Quản lý đánh giá",
                                                icon: <StarOutlined/>,
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
                                    <AdminApp/>
                                    <ClientApp/>
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
        </HelmetProvider>
    );
}

export default App;