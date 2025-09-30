import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute= ({ allowedRoles, children })=>{
    const user = JSON.parse(sessionStorage.getItem('user'));

    function lowercaseFirstLetter(word) {
        return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
    }

    if (!user) {
        return <Navigate to={"/login"} replace />
    }

    if (allowedRoles != (user.role)) {
        return <Navigate to={`/${lowercaseFirstLetter(user.role)}`} />
    }

    return children
}
export default ProtectedRoute;