import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../config/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const {user} = useContext(UserContext);

  function normalizedRole(word) {
    return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(normalizedRole(user.role))) {
    return <Navigate to={`/${normalizedRole(user.role)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;