import {Navbar} from "./navbar/Navbar";

export const HeaderBottom = () => {
    return (
        <div className="header-bottom-area bg-black sticky-header">
            <div className="container-fluid">
                <Navbar/>
            </div>
        </div>
    )
}