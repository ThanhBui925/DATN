import {SingleBlog} from "./SingleBlog";

export const BlogList = () => {
    return (
        <div className="col-lg-9 order-1 order-lg-2">
            <div className="blog-content-wrap mt-95">
                <div className="row">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <SingleBlog/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <ul className="pagination-box mt-10">
                        <li><a className="Previous" href="#"><i className="fa fa-chevron-left"></i> Previous</a>
                        </li>
                        <li className="active"><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li>
                            <a className="Next" href="#"> Next <i className="fa fa-chevron-right"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}