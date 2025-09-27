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
                    <Link to="/login"><button id="logInBtn" id="logInBtn">Log In</button></Link>
                    <button onClick={() => { navigate("/register") }} id="SignUpBtn" id="SignUpBtn">Sign Up</button>
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