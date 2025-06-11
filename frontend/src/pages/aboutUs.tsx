import {Breadcrumb} from "../components/Breadcrumb";

export const AboutUsPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Về chúng tôi",
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container">
                    <div className="row ">
                        <div className="col-lg-6">
                            <div className="about-us-img">
                                <img alt="" src="img/about/about1.jpg"/>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-info-wrapper">
                                <h2>Our company</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum ullam repellat
                                    mollitia odio aliquid, assumenda, quis, reprehenderit, fugit hic optio sit! Vitae id
                                    quisquam aperiam sint amet perspiciatis, praesentium quasi!</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum ullam repellat
                                    mollitia odio aliquid, assumenda, quis, reprehenderit, fugit hic optio sit!
                                    Vitae.</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum ullam repellat
                                    mollitia odio aliquid, assumenda, quis, reprehenderit,</p>
                                <div className="read-more-btn">
                                    <a href="#">read more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-count-area bg-gray pt-80 pb-50 mt-95">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-briefcase-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">360</h2>
                                    <span>project done</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-wineglass-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">690</h2>
                                    <span>cups of coffee</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-ios-lightbulb-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">420</h2>
                                    <span>branding</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-count text-center mb-30">
                                <div className="count-icon">
                                    <span className="ion-happy-outline"></span>
                                </div>
                                <div className="count-title">
                                    <h2 className="count">100</h2>
                                    <span>happy clients</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="About-us-team-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-titel-three">
                                <h2>our exclusive team</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="" src="img/about/team-1.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a>
                                            </li>
                                            <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a>
                                            </li>
                                            <li><a className="vimeo" href="#"><i className="fa fa-vimeo"></i></a></li>
                                            <li><a className="instagram" href="#"><i
                                                className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Marcos Alonso</h3>
                                    <p>web designer</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="" src="img/about/team-2.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a>
                                            </li>
                                            <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a>
                                            </li>
                                            <li><a className="vimeo" href="#"><i className="fa fa-vimeo"></i></a></li>
                                            <li><a className="instagram" href="#"><i
                                                className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Alonso Marcos</h3>
                                    <p>Maria Alessis</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="" src="img/about/team-3.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a>
                                            </li>
                                            <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a>
                                            </li>
                                            <li><a className="vimeo" href="#"><i className="fa fa-vimeo"></i></a></li>
                                            <li><a className="instagram" href="#"><i
                                                className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>Alex Johan</h3>
                                    <p> web developer</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="single-our-team">
                                <div className="our-team-image">
                                    <img alt="" src="img/about/team-4.jpg"/>
                                    <div className="team-social-link">
                                        <ul>
                                            <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a>
                                            </li>
                                            <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a>
                                            </li>
                                            <li><a className="vimeo" href="#"><i className="fa fa-vimeo"></i></a></li>
                                            <li><a className="instagram" href="#"><i
                                                className="fa fa-instagram"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="our-team-info">
                                    <h3>John Doe</h3>
                                    <p>php developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="testimonials-area">
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-lg-8">
                            <div className="testimonials-active owl-carousel">
                                <div className="single-testimonial text-center">
                                    <img alt="" src="/img/team/1.png"/>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation.</p>
                                    <h4>tayeb rayed</h4>
                                    <span>ui/ux Designer</span>
                                </div>
                                <div className="single-testimonial text-center">
                                    <img alt="" src="/img/team/1.png"/>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation.</p>
                                    <h4>Alex johan</h4>
                                    <span>ui/ux Designer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}