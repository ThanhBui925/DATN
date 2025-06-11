export const HeaderTop = () => {
    return (
            <div className="header-top bg-black">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-4">
                            <div className="welcome-msg">
                                <p>Chào mừng đến với bình nguyên vô tận !</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-8">
                            <div className="full-setting-area">
                                <div className="top-dropdown">
                                    <ul>
                                        <li className="drodown-show"><span>Tiền tệ:</span> <a href="#">VNĐ
                                            {/*<i className="fa fa-angle-down"></i>*/}
                                        </a>
                                            <ul className="open-dropdown">
                                                <li><a href="#">EUR €</a></li>
                                                <li><a href="#">USD $</a></li>
                                            </ul>
                                        </li>
                                        <li className="drodown-show"><span>Ngôn ngữ:</span> <a href="#"><img
                                            src="/img/icon/vn_flag.png" style={{ height: 15, width: 20}} alt=""/> Tiếng Việt
                                            {/*<i className="fa fa-angle-down"></i>*/}
                                        </a>
                                            <ul className="open-dropdown">
                                                <li><a href="#"><img src="img/icon/p-1.jpg" alt=""/> English</a></li>
                                                <li><a href="#"><img src="img/icon/p-2.jpg" alt=""/> Français</a></li>
                                            </ul>
                                        </li>
                                        {/*<li className="drodown-show"><a href="#"> Setting <i*/}
                                        {/*    className="fa fa-angle-down"></i></a>*/}
                                        {/*    <ul className="open-dropdown setting">*/}
                                        {/*        <li><a href="my-account.html">My account</a></li>*/}
                                        {/*        <li><a href="checkout.html">Checkout</a></li>*/}
                                        {/*        <li><a href="login-register.html">Sign in</a></li>*/}
                                        {/*    </ul>*/}
                                        {/*</li>*/}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}