export const ProfileSidebar = () => {
    return (
        <div className="col-md-12 col-lg-2">
            <ul className="nav flex-column dashboard-list" role="tablist">
                <li><a className="nav-link active" data-bs-toggle="tab" href="#dashboard">Dashboard</a></li>
                <li><a className="nav-link" data-bs-toggle="tab" href="#orders">Orders</a></li>
                <li><a className="nav-link" data-bs-toggle="tab" href="#downloads">Downloads</a></li>
                <li><a className="nav-link" data-bs-toggle="tab" href="#address">Addresses</a></li>
                <li><a className="nav-link" data-bs-toggle="tab" href="#account-details">Account details</a></li>
                <li><a className="nav-link" href="login-register.html">logout</a></li>
            </ul>
        </div>
    )
}