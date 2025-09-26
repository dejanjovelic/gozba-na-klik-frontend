import React from "react";
import { Link } from "react-router-dom";
import "../../styles/global.scss"

const Header = () => {
    return (
        <nav>
            <div className="button-section">
                <Link to="/login"><button id="logInBtn">Log In</button></Link>
                <button id="SignUpBtn">Sign Up</button>
            </div>
        </nav>
    )
}
export default Header;