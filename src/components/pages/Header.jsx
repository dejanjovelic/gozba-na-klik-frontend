import { useAuth } from "../../config/AuthContext";
import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/global.scss";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  async function GetUserAsync() {

  }

  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [isLoggedIn]); //Kada se promenmi isLoggedIn se zatvara dropdown, ovo radimo ako se izlogujemo i ulogujemo opet
  return (
    <nav>

      <div className="button-section">
        {!isLoggedIn ? (
          <div>
            <button onClick={() => { navigate("/login") }} id="logInBtn">Log In</button>
            <button onClick={() => { navigate("/register") }} id="SignUpBtn">Sign Up</button>
          </div>
        ) : (
        <>
          <span
            id="profileDropDownList"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <CircleUser size={40} />
          </span>

          <div
            id="DropDownMenuContent"
            className={open ? "open" : ""}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <div className="DropDownMenuItem">
              <Link to="/profile">
                <CircleUser />
                PROFILE
              </Link>
            </div>
            <div className="DropDownMenuItem">
              <button id="logoutButton" onClick={logout}>
                <LogOut></LogOut>
                Logout
              </button>
            </div>
          </div>
        </>
        )}
      </div>

    </nav>
  );
};
export default Header;
