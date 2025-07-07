import {AuthPage} from "@refinedev/antd";

export const Login = () => {
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
                                <h1 className="cE_Tbx text-original-base">Đăng nhập</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthPage
                type="login"
                formProps={{
                    initialValues: {email: "admin@gmail.com", password: "12345678"},
                }}
            />
        </>
    );
};
