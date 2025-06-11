export const Slider = () => {
    return (
        <div className="slider-main-area">
            <div className="slider-active owl-carousel">
                <div className="slider-wrapper" style={{ backgroundImage:'url(/img/slider/home-1-01.jpg)' }}>
                    <div className="container-fluid">
                        <div className="row justify-content-end">
                            <div className="col-lg-11 col-md-11">
                                <div className="slider-text-info style-1 slider-text-animation">
                                    <h4 className="title1">Big sale up to 20% off</h4>
                                    <h1 className="title2"><span>nike</span> Black</h1>
                                    <p>History Month Collection 2018</p>
                                    <div className="slier-btn-1">
                                        <a title="shop now" href="#" className="shop-btn">Shopping now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="slider-wrapper" style={{ backgroundImage:'url(/img/slider/home-1-02.jpg)' }}>
                    <div className="container-fluid">
                        <div className="row justify-content-end">
                            <div className="col-lg-11 col-md-11">
                                <div className="slider-text-info style-1 slider-text-animation">
                                    <h4 className="title1">trending products 2018</h4>
                                    <h1 className="title2"><span>new</span> lookbook</h1>
                                    <p>Juta Store | Clothing & Sport Equipment</p>
                                    <div className="slier-btn-1">
                                        <a title="shop now" href="#" className="shop-btn">Shopping now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="slider-wrapper" style={{ backgroundImage:'url(/img/slider/home-1-03.jpg)' }}>
                    <div className="container-fluid">
                        <div className="row justify-content-end">
                            <div className="col-lg-11 col-md-11">
                                <div className="slider-text-info style-1 slider-text-animation">
                                    <h4 className="title1">top jacket of Juta</h4>
                                    <h1 className="title2"><span>new </span> jackets</h1>
                                    <p>Aurora Shell Jacket Is Ready For Any Adventure.</p>
                                    <div className="slier-btn-1">
                                        <a title="shop now" href="#" className="shop-btn">Shopping now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}