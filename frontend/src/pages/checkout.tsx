import {Breadcrumb} from "../components/Breadcrumb";

export const Checkout = () => {
    const breadcrumb = {
        breadcrumb1: 'Trang chủ',
        breadcrumb2: 'Thanh toán',
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12 col-xl-10 offset-xl-1">
                            <div className="coupon-area mb-60">
                                <div className="coupon-accordion">
                                    <h3>Returning customer? <span id="showlogin"
                                                                  className="coupon">Click here to login</span></h3>
                                    <div id="checkout-login" className="coupon-content">
                                        <div className="coupon-info">
                                            <p>If you have shopped with us before, please enter your details in the
                                                boxes below. If you are a new customer, please proceed to the Billing &
                                                Shipping section.</p>
                                            <form action="#">
                                                <p className="coupon-input form-row-first">
                                                    <label>Username or email <span className="required">*</span></label>
                                                    <input type="text" name="email"/>
                                                </p>
                                                <p className="coupon-input form-row-last">
                                                    <label>password <span className="required">*</span></label>
                                                    <input type="password" name="password"/>
                                                </p>
                                                <div className="clear"></div>
                                                <p>
                                                    <button value="Login" name="login" className="button-login"
                                                            type="submit">Login
                                                    </button>
                                                    <label><input type="checkbox"
                                                                  value="1"/><span>Remember me</span></label>
                                                </p>
                                                <p className="lost-password">
                                                    <a href="#">Lost your password?</a>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="coupon-accordion">
                                    <h3>Have a coupon? <span id="showcoupon" className="coupon">Click here to enter your code</span>
                                    </h3>
                                    <div id="checkout-coupon" className="coupon-content">
                                        <div className="coupon-info">
                                            <form action="#">
                                                <p className="checkout-coupon">
                                                    <input type="text" placeholder="Coupon code"/>
                                                    <button value="Apply coupon" name="apply_coupon"
                                                            className="button-apply-coupon" type="submit">Apply coupon
                                                    </button>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="checkout-area">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-lg-6 offset-xl-1 col-xl-5 col-sm-12">
                                        <form action="#">
                                            <div className="checkbox-form">
                                                <h3 className="shoping-checkboxt-title">Billing Details</h3>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <p className="single-form-row">
                                                            <label>First name <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="First name"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <p className="single-form-row">
                                                            <label>Username or email <span className="required">*</span></label>
                                                            <input type="text" name="Last name "/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Company name</label>
                                                            <input type="text" name="email"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="single-form-row">
                                                            <label>Country <span className="required">*</span></label>
                                                            <div className="nice-select wide">
                                                                <select>
                                                                    <option>Select Country...</option>
                                                                    <option>Albania</option>
                                                                    <option>Angola</option>
                                                                    <option>Argentina</option>
                                                                    <option>Austria</option>
                                                                    <option>Azerbaijan</option>
                                                                    <option>Bangladesh</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Street address <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="address"
                                                                   placeholder="House number and street name"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <input type="text" name="address"
                                                                   placeholder="Apartment, suite, unit etc. (optional)"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Town / City <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="address"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>State / County</label>
                                                            <input type="text" name="address"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Postcode / ZIP <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="address"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Phone</label>
                                                            <input type="text" name="address"/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row">
                                                            <label>Email address <span
                                                                className="required">*</span></label>
                                                            <input type="text" name="Email address "/>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="single-form-row checkout-area">
                                                            <label><input type="checkbox" id="chekout-box"/> Create an
                                                                account?</label>
                                                            <div className="account-create single-form-row">
                                                                <label className="creat-pass">Create account
                                                                    password <span>*</span></label>
                                                                <input type="password" className="input-text"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="single-form-row">
                                                            <label id="chekout-box-2"><input type="checkbox"/> Ship to a
                                                                different address?</label>
                                                            <div className="ship-box-info">
                                                                <div className="row">
                                                                    <div className="col-lg-6">
                                                                        <p className="single-form-row">
                                                                            <label>First name <span
                                                                                className="required">*</span></label>
                                                                            <input type="text" name="First name"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <p className="single-form-row">
                                                                            <label>Username or email <span
                                                                                className="required">*</span></label>
                                                                            <input type="text" name="Last name "/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <label>Company name</label>
                                                                            <input type="text" name="email"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <div className="single-form-row">
                                                                            <label>Country <span
                                                                                className="required">*</span></label>
                                                                            <div className="nice-select wide">
                                                                                <select>
                                                                                    <option>Select Country...</option>
                                                                                    <option>Albania</option>
                                                                                    <option>Angola</option>
                                                                                    <option>Argentina</option>
                                                                                    <option>Austria</option>
                                                                                    <option>Azerbaijan</option>
                                                                                    <option>Bangladesh</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <label>Street address <span
                                                                                className="required">*</span></label>
                                                                            <input type="text" name="address"
                                                                                   placeholder="House number and street name"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <input type="text" name="address"
                                                                                   placeholder="Apartment, suite, unit etc. (optional)"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <label>Town / City <span
                                                                                className="required">*</span></label>
                                                                            <input type="text" name="address"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <label>State / County</label>
                                                                            <input type="text" name="address"/>
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-lg-12">
                                                                        <p className="single-form-row">
                                                                            <label>Postcode / ZIP <span
                                                                                className="required">*</span></label>
                                                                            <input type="text" name="address"/>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <p className="single-form-row m-0">
                                                            <label>Order notes</label>
                                                            <textarea cols={5} rows={2} className="checkout-mess"
                                                                      placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-lg-6  col-xl-5 col-sm-12">
                                        <div className="checkout-review-order">
                                            <form action="#">
                                                <h3 className="shoping-checkboxt-title">Your order</h3>
                                                <table className="checkout-review-order-table">
                                                    <thead>
                                                    <tr>
                                                        <th className="t-product-name">Product</th>
                                                        <th className="product-total">Total</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr className="cart_item">
                                                        <td className="t-product-name">Natus erro<strong
                                                            className="product-quantity">× 1</strong></td>
                                                        <td className="t-product-price"><span>$97.20</span></td>
                                                    </tr>
                                                    </tbody>
                                                    <tfoot>
                                                    <tr className="cart-subtotal">
                                                        <th>Subtotal</th>
                                                        <td><span>$97.00</span></td>
                                                    </tr>
                                                    <tr className="shipping">
                                                        <th>Shipping</th>
                                                        <td>Free shipping</td>
                                                    </tr>
                                                    <tr className="order-total">
                                                        <th>Total</th>
                                                        <td><strong><span>$97.00</span></strong></td>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                                <div className="checkout-payment">
                                                    <div className="payment_methods">
                                                        <p><label>PayPal Express Checkout <a href="#"><img
                                                            src="img/icon/pp-acceptance-small.png" alt=""/></a></label>
                                                        </p>
                                                        <p>Pay via PayPal; you can pay with your credit card if you
                                                            don’t have a PayPal account.</p>
                                                    </div>
                                                    <button className="button-continue-payment" type="submit">Continue
                                                        to payment
                                                    </button>
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