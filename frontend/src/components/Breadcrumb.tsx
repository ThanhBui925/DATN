import { Link } from "react-router-dom"

export const Breadcrumb = (props: any) => {
    return (
        <div className="breadcrumb-area bg-gray">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <ul className="breadcrumb-list">
                            <li className="breadcrumb-item"><Link to="/"> { props.breadcrumb1 } </Link></li>
                            <li className="breadcrumb-item active">{ props.breadcrumb2 }</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}