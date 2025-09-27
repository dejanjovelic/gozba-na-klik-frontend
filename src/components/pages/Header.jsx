import { useAuth } from "../../config/AuthContext";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/global.scss";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function GetUserAsync() {

  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setOpen(false);
  }, [isLoggedIn]); //Kada se promenmi isLoggedIn se zatvara dropdown, ovo radimo ako se izlogujemo i ulogujemo opet
  return (
    <nav>
      {!isLoggedIn ? (
        <div className="button-section">
          <button onClick={() => { navigate("/login") }} id="logInBtn">Log In</button>
          <button onClick={() => { navigate("/register") }} id="SignUpBtn">Sign Up</button>
        </div>
      ) : (
        <div className="nav-bar-container" ref={dropdownRef}>
          <span id="profileDropDownList" onClick={() => setOpen(prev => !prev)}>
            <CircleUser size={35} />
          </span>

          <div id="DropDownMenuContent" className={open ? "open" : ""}>
            <div className="DropDownMenuItem">
              <Link to="/profile">
                <CircleUser />
                PROFILE
              </Link>
            </div>
            <div className="DropDownMenuItem">
              <button id="logoutButton" onClick={logout}>
                <LogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );

};

export default Header;
