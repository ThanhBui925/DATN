import React, {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {Header} from "../components/header/Header";
import {Footer} from "../components/footer/Footer";
import {Modal} from "../components/modal/Modal";

const ClientLayout = () => {
    const location = useLocation();

    useEffect(() => {
        const scripts = [
            "/js/vendor/jquery-3.5.1.min.js",
            "/js/vendor/jquery-migrate-3.3.0.min.js",
            "/js/bootstrap.min.js",
            "/js/owl.carousel.min.js",
            "/js/jquery.mainmenu.js",
            "/js/ajax-email.js",
            "/js/plugins.js",
            "/js/main.js",
            "/js/vendor/modernizr-2.8.3.min.js"
        ];

        scripts.forEach(src => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        });

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            document.body.appendChild(script);
        });

        return () => {
            scripts.forEach(src => {
                const existingScript = document.querySelector(`script[src="${src}"]`);
                if (existingScript) {
                    existingScript.remove();
                }
            });
        };
    }, [location]);

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
            </head>
            <div className="wrapper">
                <Header/>
                <main>
                    <Outlet/>
                </main>

                <Footer />
                <Modal />
            </div>
        </>
    );
};

export default ClientLayout;
