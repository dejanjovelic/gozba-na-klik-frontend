import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const {user, loading} = useContext(UserContext);
  
  function normalizedRole(word) {
    if (!word) return "";
    return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  }

  if (loading) {
    return <Spinner />;
  }

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(normalizedRole(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;