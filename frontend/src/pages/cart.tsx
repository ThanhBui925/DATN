import {Breadcrumb} from "../components/Breadcrumb";

export const Cart = () => {
    const breadcrumb = {
        breadcrumb1: 'Trang chủ',
        breadcrumb2: 'Giỏ hàng',
    }
    return (
        <>
            <Breadcrumb {...breadcrumb} />
            <div className="content-wraper mt-95">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <form action="#" className="cart-table">
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="plantmore-product-remove">remove</th>
                                            <th className="plantmore-product-thumbnail">images</th>
                                            <th className="cart-product-name">Product</th>
                                            <th className="plantmore-product-price">Unit Price</th>
                                            <th className="plantmore-product-quantity">Quantity</th>
                                            <th className="plantmore-product-subtotal">Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td className="plantmore-product-remove"><a href="#"><i
                                                className="fa fa-times"></i></a></td>
                                            <td className="plantmore-product-thumbnail"><a href="#"><img
                                                src="img/cart/1.jpg" alt=""/></a></td>
                                            <td className="plantmore-product-name"><a href="#">Air Jordan XI Retro</a>
                                            </td>
                                            <td className="plantmore-product-price"><span
                                                className="amount">$70.00</span></td>
                                            <td className="plantmore-product-quantity">
                                                <input value="1" type="number"/>
                                            </td>
                                            <td className="product-subtotal"><span className="amount">$70.00</span></td>
                                        </tr>
                                        <tr>
                                            <td className="plantmore-product-remove"><a href="#"><i
                                                className="fa fa-times"></i></a></td>
                                            <td className="plantmore-product-thumbnail"><a href="#"><img
                                                src="img/cart/2.jpg" alt=""/></a></td>
                                            <td className="plantmore-product-name"><a href="#">Brand Zoom KDX EP</a>
                                            </td>
                                            <td className="plantmore-product-price"><span
                                                className="amount">$60.50</span></td>
                                            <td className="plantmore-product-quantity">
                                                <input value="1" type="number"/>
                                            </td>
                                            <td className="product-subtotal"><span className="amount">$60.50</span></td>
                                        </tr>
                                        <tr>
                                            <td className="plantmore-product-remove"><a href="#"><i
                                                className="fa fa-times"></i></a></td>
                                            <td className="plantmore-product-thumbnail"><a href="#"><img
                                                src="img/cart/3.jpg" alt=""/></a></td>
                                            <td className="plantmore-product-name"><a href="#">Brand FREE RN 2018</a>
                                            </td>
                                            <td className="plantmore-product-price"><span
                                                className="amount">$40.50</span></td>
                                            <td className="plantmore-product-quantity">
                                                <input value="1" type="number"/>
                                            </td>
                                            <td className="product-subtotal"><span className="amount">$40.50</span></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="coupon-all">
                                            <div className="coupon">
                                                <input id="coupon_code" className="input-text" name="coupon_code"
                                                       value="" placeholder="Coupon code" type="text"/>
                                                <input className="button" name="apply_coupon" value="Apply coupon"
                                                       type="submit"/>
                                            </div>
                                            <div className="coupon2">
                                                <input className="button" name="update_cart" value="Update cart"
                                                       type="submit"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5 ml-auto">
                                        <div className="cart-page-total">
                                            <h2>Cart totals</h2>
                                            <ul>
                                                <li>Subtotal <span>$170.00</span></li>
                                                <li>Total <span>$170.00</span></li>
                                            </ul>
                                            <a href="#">Proceed to checkout</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}