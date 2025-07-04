import {TOKEN_KEY} from "../providers/authProvider";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const Checkout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            alert("Vui lòng đăng nhập.");
            navigate('/dang-nhap');
        }
    }, [navigate]);
    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex gap-4">
                                <a className={`d-sm-block d-none`} href="/trang-chu">
                                    <img className={`mt-2`} src="/img/logo/logo.png" alt=""/>
                                </a>
                                <h1 className="cE_Tbx text-original-base"> Thanh toán</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content-wraper mt-95">
                <div className="container-fluid">
                    <div className="checkout-area">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-6 offset-xl-1 col-xl-5 col-sm-12">
                                        <form action="#">
                                            <div className="checkbox-form">
                                                <h3 className="shoping-checkboxt-title">Thanh toán đơn hàng</h3>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <p className="single-form-row">
                                                            <label>Họ và tên <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="recepient_name"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <p className="single-form-row">
                                                            <label>Email <span className="required">*</span></label>
                                                            <input type="email" name="recepient_email "/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Số điện thoại<span
                                                                className="required">*</span></label>
                                                            <input type="text" name="recepient_phone"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Địa chỉ nhận hàng <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="address"
                                                                   placeholder="Nhập đầy đủ địa chỉ"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row m-0">
                                                            <label>Ghi chú</label>
                                                            <textarea cols={5} rows={2} name={`note`}
                                                                      className="checkout-mess"
                                                                      placeholder="Ghi chú đơn hàng."></textarea>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-lg-6 col-xl-5 col-sm-12">
                                        <div className="checkout-review-order">
                                            <form action="#">
                                                <h3 className="shoping-checkboxt-title">Thông tin đơn hàng</h3>
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead className="thead-light">
                                                        <tr>
                                                            <th className="text-start">Sản phẩm</th>
                                                            <th className="text-start">Tổng tiền</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr className="cart_item">
                                                            <td className="text-start">
                                                                Natus erro <strong className="product-quantity">×
                                                                1</strong>
                                                            </td>
                                                            <td className="text-start"><span>$97.20</span></td>
                                                        </tr>
                                                        </tbody>
                                                        <tfoot>
                                                        <tr className="cart-subtotal">
                                                            <th className="text-start">Tổng tiền sản phẩm</th>
                                                            <td className="text-start"><span>$97.00</span></td>
                                                        </tr>
                                                        <tr className="shipping">
                                                            <th className="text-start">Phí ship</th>
                                                            <td className="text-start">Free shipping</td>
                                                        </tr>
                                                        <tr className="order-total">
                                                            <th className="text-start">Tổng tiền</th>
                                                            <td className="text-start">
                                                                <strong><span>$97.00</span></strong></td>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}