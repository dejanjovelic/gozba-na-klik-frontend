import { useAuth } from "../../config/AuthContext";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/global.scss";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from 'lucide-react';
import SideBar from "../sharedComponents/SideBar";
import { Drawer } from "@mui/material";


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  async function GetUserAsync() {

  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };



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

  const toggleDrawer = (newOpen) => {
    setOpenSideMenu(newOpen)
  }

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
          <div className="menu-div" onClick={() => toggleDrawer(!openSideMenu)}>
            <Menu className={`menu-icon ${openSideMenu ? 'active' : ''}`} />
          </div>
          <Drawer className="homePageLayout" open={openSideMenu}
            onClose={() => toggleDrawer(false)}
          >
            <SideBar onLogout={handleLogout} onCloseSideMenu={() => toggleDrawer(false)} />
          </Drawer>

          <div className="logo-div"></div>

          <div className="user-profile-div">
            <span id="profileDropDownList" onClick={() => setOpen(prev => !prev)}>
              {user.profileImageUrl ?
                (<img src={user.profileImageUrl} alt="Profile picture" />)
                :
                (<CircleUser className="user-icon" size={25} />)
              }
              <div className="user-fullname"> {user.name} {user.surname}</div>
            </span>

            <div id="DropDownMenuContent" className={open ? "open" : ""}>
              <div className="DropDownMenuItem">
                <Link to="/profile">
                  <CircleUser />
                  My profile
                </Link>
              </div>
              <div className="DropDownMenuItem">
                <button id="logoutButton" onClick={handleLogout}>
                  <LogOut />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </nav>
  );

};

export default Header;
