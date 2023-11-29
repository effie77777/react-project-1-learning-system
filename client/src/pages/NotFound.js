import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="text-center" style={{height: "calc(100vh - 64px)", background: "#eeeeee", paddingTop: "4rem"}}>
            <h3 className="alert fw-bold" style={{fontSize: "2.25rem", color:"#a0a0a0"}}>Page Not Found</h3>
            <Link to="/" className="text-decoration-none p-2" style={{color: "#a0a0a0", borderBottom: "#a0a0a0 1px solid"}}>帶我回首頁</Link>
        </div>
    )
}

export default NotFound;