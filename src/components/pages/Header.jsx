import React from "react";
import { Link } from "react-router-dom";
import "../../styles/global.scss"

const Header = () => {
    return (
        <nav>
            <div className="button-section">
                <button>Log In</button>
                <button>Sign Up</button>
            </div>
        </nav>
    )
}
export default Header;