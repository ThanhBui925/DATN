import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { Modal } from "../components/modal/Modal";
import { Helmet } from 'react-helmet-async';

const ClientLayout = () => {
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
                <meta charSet="utf-8"/>
                <meta http-equiv="x-ua-compatible" content="ie=edge"/>
                <title>SportWolk - Shop thể thao</title>
                <meta name="description" content=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/x-icon" href="/img/logo/favicon.ico"/>
                <link rel="icon" href="/img/logo/favicon-2.ico"/>
                <link rel="icon" type="image/png" sizes="192x192" href="/img/logo/logo.png"/>
                <link rel="stylesheet" href="/css/bootstrap.min.css"/>
                <link rel="stylesheet" href="/css/font-awesome.min.css"/>
                <link rel="stylesheet" href="/css/ionicons.min.css"/>
                <link rel="stylesheet" href="/css/animate.css"/>
                <link rel="stylesheet" href="/css/nice-select.css"/>
                <link rel="stylesheet" href="/css/owl.carousel.min.css"/>
                <link rel="stylesheet" href="/css/mainmenu.css"/>
                <link rel="stylesheet" href="/style.css"/>
                <link rel="stylesheet" href="/css/responsive.css"/>
            </Helmet>

            <div className="wrapper">
                <Header/>
                <main>
                    <Outlet />
                </main>
                <Footer />
                <Modal />
            </div>
        </>
    );
};

export default ClientLayout;
