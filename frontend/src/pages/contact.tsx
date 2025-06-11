import {Breadcrumb} from "../components/Breadcrumb";

export const ContactPage = () => {
    const breadcrumb = {
        breadcrumb1: "Trang chủ",
        breadcrumb2: "Liên hệ",
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper">
                <div className="container-fluid  p-0">
                    <div className="row no-gutters">
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12">
                            <div className="contact-form-inner">
                                <h2>TELL US YOUR PROJECT</h2>
                                <form id="contact-form" method="POST" action="https://htmldemo.net/juta/juta-v1/email.php">
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="First name*" name="name"/>
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="Last name*" name="lastname"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-lg-6">
                                            <input type="email" placeholder="Email*" name="email"/>
                                        </div>
                                        <div className="col-md-6 col-lg-6">
                                            <input type="text" placeholder="Subject*" name="subject"/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <textarea placeholder="Message *" name="message"></textarea>
                                        </div>
                                    </div>
                                    <div className="contact-submit-btn">
                                        <button className="submit-btn" type="submit">Send Email</button>
                                        <p className="form-messege"></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12 plr-0">
                            <div className="contact-address-area">
                                <h2>CONTACT US</h2>
                                <p>Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum.
                                    Mirum est
                                    notare quam littera gothica, quam nunc putamus parum claram anteposuerit litterarum
                                    formas human.</p>
                                <ul>
                                    <li>
                                        <i className="fa fa-fax">&nbsp;</i> Address : No 40 Baria Sreet 133/2 NewYork City
                                    </li>
                                    <li>
                                        <i className="fa fa-phone">&nbsp;</i> Info@roadthemes.com
                                    </li>
                                    <li>
                                        <i className="fa fa-envelope-o"></i>&nbsp; 0(1234) 567 890
                                    </li>
                                </ul>
                                <h3>
                                    Working hours
                                </h3>
                                <p className="m-0"><strong>Monday &ndash; Saturday</strong>: &nbsp;08AM &ndash; 22PM</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-page-map">
                    <div className="container-fluid p-0">
                        <div id="map"></div>
                    </div>
                </div>
            </div>
        </>
    )
}