export const NewLetter = () => {
    return (
        <div className="newsletter-area ptb-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="newsletter-inner text-center newsletter-bg">
                            <h4 className="text">Tham gia</h4>
                            <h2>Nhận tin tức mới nhất !</h2>
                            <p className="desc">Theo dõi kênh SportWolk để nhận được email mới nhất về danh sách mã giảm giá,
                                danh sách chương trình giảm giá</p>
                            <form
                                method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form"
                                className="newletter-input popup-subscribe-form validate" target="_blank"
                                noValidate>
                                <input id="mc-email" type="email" autoComplete="off" placeholder="Nhập email của bạn"/>
                                <button type="button" className="btn btn-primary">
                                    <span>Theo dõi !</span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}