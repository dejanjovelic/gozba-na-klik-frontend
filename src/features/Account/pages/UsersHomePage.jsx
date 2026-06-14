import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import UserContext from "../../../shared/context/UserContext";

const UsersHomePage = () => {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <main>
      <Outlet />
    </main>
  );
};

export default UsersHomePage;
