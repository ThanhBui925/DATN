import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Modal } from "../components/modal/Modal";
import { Helmet } from 'react-helmet-async';
import {HeaderTop} from "../components/header/HeaderTop";
import {HeaderMid} from "../components/header/HeaderMid";
import {HeaderBottom} from "../components/header/HeaderBottom";

const ClientLayout2 = () => {
    const location = useLocation();

    useEffect(() => {
        const scripts = [
            "/js/vendor/jquery-3.5.1.min.js",
            "/js/bootstrap.min.js",
            "/js/jquery.mainmenu.js",
            "/js/ajax-email.js",
            "/js/plugins.js",
            "/js/main.js",
            "/js/vendor/modernizr-2.8.3.min.js"
        ];

        scripts.forEach(src => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement("script");
                script.src = src;
                script.async = false;
                document.body.appendChild(script);
            }
        });
    }, [location]);

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <meta http-equiv="x-ua-compatible" content="ie=edge" />
                <title>Home || SportWolk - Ecommerce Bootstrap 5 Template</title>
                <meta name="description" content="" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico" />
                <link rel="stylesheet" href="/css/bootstrap.min.css" />
                <link rel="stylesheet" href="/css/font-awesome.min.css" />
                <link rel="stylesheet" href="/css/ionicons.min.css" />
                <link rel="stylesheet" href="/css/animate.css" />
                <link rel="stylesheet" href="/css/nice-select.css" />
                <link rel="stylesheet" href="/css/owl.carousel.min.css" />
                <link rel="stylesheet" href="/css/mainmenu.css" />
                <link rel="stylesheet" href="/style.css" />
                <link rel="stylesheet" href="/css/responsive.css" />
            </Helmet>

            <div className="wrapper">
                <header>
                    <HeaderTop/>
                </header>
                <main>
                    <Outlet/>
                </main>
                <Footer/>
                <Modal />
            </div>
        </>
    );
};

export default ClientLayout2;
