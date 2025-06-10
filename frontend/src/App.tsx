import "@refinedev/antd/dist/reset.css";

import {BrowserRouter} from "react-router";
import React from "react";
import {AdminApp} from "./AdminApp";
import {ClientApp} from "./ClientApp";

function App() {
    return (
        <BrowserRouter>
            <AdminApp />
            <ClientApp />
        </BrowserRouter>
    );
}

export default App;