import { useAuth } from "../../config/AuthContext";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/global.scss";
const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="button-section">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button id="logInBtn">Log In</button>
            </Link>
            <Link to="/signup">
              <button id="SignUpBtn">Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <button
              id="profileDropDownList"
              onClick={() => setOpen(!open)}
              type="button"
            >
              <img src="..." />
            </button>
            {open && (
              <ul>
                <li id="profilePictureContainer">
                  <Link to="/profile">
                    <img />
                    PROFILE
                  </Link>
                </li>
                <li id="logoutButtonContainer">
                  <button id="logoutButton" onClick={logout}>
                    <img />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </>
        )}
      </div>
    </nav>
  );
};
export default Header;
