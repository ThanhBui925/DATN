export const ProfileContent = () => {
    return (
        <div className="col-md-12 col-lg-10">
            <div className="tab-content dashboard-content">
                <div id="dashboard" className="tab-pane fade show active">
                    <h3>Dashboard </h3>
                    <p>From your account dashboard. you can easily check &amp; view your <a href="#">recent
                        orders</a>, manage your <a href="#">shipping and billing addresses</a> and <a href="#">edit
                        your password and account details.</a></p>
                </div>
                <div id="orders" className="tab-pane fade">
                    <h3>Orders</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>May 10, 2018</td>
                                <td>Processing</td>
                                <td>$25.00 for 1 item</td>
                                <td><a className="view" href="cart.html">view</a></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>May 10, 2018</td>
                                <td>Processing</td>
                                <td>$17.00 for 1 item</td>
                                <td><a className="view" href="cart.html">view</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="downloads" className="tab-pane fade">
                    <h3>Downloads</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Downloads</th>
                                <th>Expires</th>
                                <th>Download</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Haven - Free Real Estate PSD Template</td>
                                <td>May 10, 2018</td>
                                <td>never</td>
                                <td><a className="view" href="#">Click Here To Download Your File</a></td>
                            </tr>
                            <tr>
                                <td>Nevara - ecommerce html template</td>
                                <td>Sep 11, 2018</td>
                                <td>never</td>
                                <td><a className="view" href="#">Click Here To Download Your File</a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="address" className="tab-pane">
                    <p>The following addresses will be used on the checkout page by default.</p>
                    <h4 className="billing-address">Billing address</h4>
                    <a className="view" href="#">edit</a>
                    <p>Johan Don</p>
                    <p>Bangladesh</p>
                </div>
                <div id="account-details" className="tab-pane fade">
                    <h3>Account details </h3>
                    <div className="login">
                        <div className="login-form-container">
                            <div className="account-login-form">
                                <form action="#">
                                    <p>Already have an account? <a href="#">Log in instead!</a></p>
                                    <label>Social title</label>
                                    <div className="input-radio">
                                            <span className="custom-radio"><input name="id_gender" value="1"
                                                                                  type="radio"/> Mr.</span>
                                        <span className="custom-radio"><input name="id_gender" value="1"
                                                                              type="radio"/> Mrs.</span>
                                    </div>
                                    <label>First Name</label>
                                    <input name="first-name" type="text"/>
                                    <label>Last Name</label>
                                    <input name="last-name" type="text"/>
                                    <label>Email</label>
                                    <input name="email-name" type="text"/>
                                    <label>Password</label>
                                    <input name="user-password" type="password"/>
                                    <label>Birthdate</label>
                                    <input name="birthday" value="" placeholder="MM/DD/YYYY" type="text"/>
                                    <span className="example">
                                                          (E.g.: 05/31/1970)
                                                        </span>
                                    <span className="custom-checkbox">
                                                            <input name="optin" value="1" type="checkbox"/>
                                                            <label>Receive offers from our partners</label>
                                                        </span>
                                    <span className="custom-checkbox">
                                                            <input name="newsletter" value="1" type="checkbox"/>
                                                            <label>Sign up for our newsletter<br/><em>You may unsubscribe at any moment. For that purpose, please find our contact info in the legal notice.</em></label>
                                                        </span>
                                    <div className="button-box">
                                        <button type="submit" className="default-btn">save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}