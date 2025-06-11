import {SingleProduct} from "../SingleProduct";

export const SpecialProductList = () => {
    return (
        <div className="product-area pb-95">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className=" section-title-2">
                            <h2>Week Special Products</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="product-active-2 owl-carousel">
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                        <div className="col">
                            <SingleProduct/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}