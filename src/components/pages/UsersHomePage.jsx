import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import UserContext from "../../config/UserContext";


const UsersHomePage = () => {
  const  {user}  = useContext(UserContext);

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
