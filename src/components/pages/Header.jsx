import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/global.scss"

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const showLogInAndSignUpBtn = location.pathname === "/register" || location.pathname === "/";

    async function GetUserAsync() {
        
    }

    return (
        <nav>
            {showLogInAndSignUpBtn ? (
                <div className="button-section">
                    <button id="logInBtn">Log In</button>
                    <button onClick={() => { navigate("/register") }} id="SignUpBtn">Sign Up</button>
                </div>
            ) : (
                <div className="nav-bar-container">
                    <div className="user-container"> 
                    <div>
                        <Link>User</Link>
                    </div>
                    </div>
                </div>


            )}

        </nav>
    )
}
export default Header;