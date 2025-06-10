export const NewLetter = () => {
    return (
        <div className="newsletter-area ptb-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="newsletter-inner text-center newsletter-bg">
                            <h4 className="text">Join our</h4>
                            <h2>Newsletters now!</h2>
                            <p className="desc">Subscribe to the Juta mailing list to receive updates on new arrivals,
                                offers and other discount information.</p>
                            <form
                                action="http://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef"
                                method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form"
                                className="newletter-input popup-subscribe-form validate" target="_blank"
                                noValidate>
                                <input id="mc-email" type="email" autoComplete="off" placeholder="Your email address"/>
                                <button id="mc-submit" type="submit" className="btn btn-primary">
                                    <span>Subscribe !</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}