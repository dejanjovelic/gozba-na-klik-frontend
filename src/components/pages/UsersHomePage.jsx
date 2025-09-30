import React from "react";
import { useAuth } from "../../config/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import SideBar from "../sharedComponents/SideBar";

const UsersHomePage = () => {
  const  user  = JSON.parse(sessionStorage.getItem('user'));

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="homePageLayout">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UsersHomePage;
