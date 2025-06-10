import React from 'react';
import {Outlet} from 'react-router-dom';
import {Header} from "../components/header/Header";

const ClientLayout = () => {
    return (
        <>
            <head>
                <meta charSet="utf-8"/>
                <meta http-equiv="x-ua-compatible" content="ie=edge"/>
                <title>Home || Juta - Ecommerce Bootstrap 5 Template</title>
                <meta name="description" content=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico"/>
                <link rel="stylesheet" href="/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="/css/ionicons.min.css"/>
                <link rel="stylesheet" href="/css/animate.css"/>
                <link rel="stylesheet" href="/css/nice-select.css"/>
                <link rel="stylesheet" href="/css/owl.carousel.min.css"/>
                <link rel="stylesheet" href="/css/mainmenu.css"/>
                <link rel="stylesheet" href="/style.css"/>
                <link rel="stylesheet" href="/css/responsive.css"/>
                <script src="/js/vendor/modernizr-2.8.3.min.js"></script>
            </head>
            <div className="wrapper">
                <Header />
                <main>
                    <Outlet/>
                </main>

                <h1>Footer</h1>
            </div>
        </>
    );
};

export default ClientLayout;
