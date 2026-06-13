import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import UserContext from "../../../shared/context/UserContext";
import "../../Account/styles/userProfilePage.scss";

const UserProfilePage = () => {
  const { user } = useContext(UserContext);
  const [isClicked, setIsClicked] = useState("profile");

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="profile-page-container">
      <div className="profile-page-wrapper">
        <div className="user-profile-links-section">
          <Link
            to="/profile/"
            className="user-profile-link"
            onClick={() => setIsClicked("profile")}
          >
            {isClicked === "profile" ? <b>Profile info</b> : "Profile info"}
          </Link>
          {user?.role === "Customer" && (
            <>
              <Link
                to="allergens"
                className="user-profile-link"
                onClick={() => setIsClicked("allergens")}
              >
                {isClicked === "allergens" ? <b>Allergens</b> : "Allergens"}
              </Link>

              <Link
                to="addresses"
                className="user-profile-link"
                onClick={() => setIsClicked("address")}
              >
                {isClicked === "address" ? <b>Address</b> : "Address"}
              </Link>

              <Link
                to="credit-cards"
                className="user-profile-link"
                onClick={() => setIsClicked("credit-cards")}
              >
                {isClicked === "credit-cards" ? (
                  <b>Credit Cards</b>
                ) : (
                  "Credit Cards"
                )}
              </Link>
            </>
          )}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfilePage;
