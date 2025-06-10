export const Banner = () => {
    return (
        <div className="banner-area">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-4 col-custom-4 col">
                        <div className="single-banner-box mb-20">
                            <a href="#"><img src="img/banner/1.jpg" alt=""/></a>
                        </div>
                        <div className="single-banner-box">
                            <a href="#"><img src="img/banner/2.jpg" alt=""/></a>
                        </div>
                    </div>
                    <div className="col-lg-4 centeritem col">
                        <div className="single-banner-box">
                            <a href="#"><img src="img/banner/3.jpg" alt=""/></a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-custom-4 col">
                        <div className="single-banner-box mb-20">
                            <a href="#"><img src="img/banner/4.jpg" alt=""/></a>
                        </div>
                        <div className="single-banner-box">
                            <a href="#"><img src="img/banner/5.jpg" alt=""/></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}