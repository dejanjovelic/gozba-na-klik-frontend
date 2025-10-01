import React from "react";
import { Outlet, Navigate } from "react-router-dom";


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
