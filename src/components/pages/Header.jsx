import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/global.scss";
import { CircleUser } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from 'lucide-react';
import SideBar from "../sharedComponents/SideBar";
import { Drawer } from "@mui/material";
import UserContext from "../../config/UserContext";


const Header = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const { user, setUser } = useContext(UserContext);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
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
  }, [user]); //Kada se promenmi isLoggedIn se zatvara dropdown, ovo radimo ako se izlogujemo i ulogujemo opet

  return (

    <nav>
      {!user ? (
        <div className="button-section">
          <button onClick={() => { navigate("/login") }} id="logInBtn">Log In</button>
          <button onClick={() => { navigate("/register") }} id="SignUpBtn">Sign Up</button>
        </div>
      ) : (

        <div className="nav-bar-container" ref={dropdownRef}>
          <div className="menu-div" onClick={() => toggleDrawer(!openSideMenu)}>
            <Menu className={`menu-icon ${openSideMenu ? 'active' : ''}`} />
          </div>
          <Drawer
            className="homePageLayout"
            open={openSideMenu}
            onClose={() => toggleDrawer(false)}
            ModalProps={{
              keepMounted: false
            }}

          >
            <SideBar onLogout={handleLogout} onCloseSideMenu={() => toggleDrawer(false)} />
          </Drawer>

          <div className="logo-div">
            <div className="user-fullname"><b>Welcome</b>, {user.name} {user.surname}</div>
          </div>

          <div className={`user-profile-div ${open ? "open" : ""}`}>
            <div className="user-info-section">

            </div>
            <span id="profileDropDownList" onClick={() => setOpen(prev => !prev)}>
              <div>
                {user.profileImageUrl ?
                  (<img className="user-img" src={user.profileImageUrl} alt="Profile picture" />)
                  :
                  (<CircleUser className="user-icon" size={25} />)
                }
                <div className="user-hover-fullname">{user.name} {user.surname}</div>
              </div>

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
