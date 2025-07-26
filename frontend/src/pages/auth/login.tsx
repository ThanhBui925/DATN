import {LoginForm} from "../../components/auth/LoginForm";

export const Login = () => {
    return (
        <>
            <div className="breadcrumb-area bg-gray">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-sm-flex gap-4 justify-content-sm-start">
                                <a href="/trang-chu">
                                    <img className={`mt-2`} style={{ height: 50 }} src="/img/logo/logo.png" alt=""/>
                                </a>
                                <hr className={`d-block d-sm-none text-danger`}/>
                                <h1 className="cE_Tbx text-original-base mt-2 mt-sm-0">Đăng nhập</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoginForm/>
        </>
    )
}