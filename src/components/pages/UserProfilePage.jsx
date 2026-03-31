import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom"
import UserContext from "../../config/UserContext";
import "../../styles/userProfilePage.scss"

const UserProfilePage = () => {
    const { user } = useContext(UserContext);
    const [isClicked, setIsClicked] = useState('profile');
    return (
        <div className="profile-page-container">
            <div className="profile-page-wrapper">
                <div className="user-profile-links-section">
                    <Link
                        to="/profile/"
                        className="user-profile-link"
                        onClick={() => setIsClicked("profile")}
                    >
                        {isClicked === "profile" ? (<b>Profile info</b>) : "Profile info"}
                    </Link>
                    <Link
                        to="allergens"
                        className="user-profile-link"
                        onClick={() => setIsClicked("allergens")}
                    >
                        {isClicked === "allergens" ? (<b>Allergens</b>) : "Allergens"}
                    </Link>
                    <Link
                        to="addresses"
                        className="user-profile-link"
                        onClick={() => setIsClicked("address")}
                    >
                        {isClicked === "address" ? (<b>Address</b>) : "Address"}
                    </Link>
                    <Link
                        to="credit-cards"
                        className="user-profile-link"
                        onClick={() => setIsClicked("credit-cards")}
                    >
                        {isClicked === "credit-cards" ? (<b>Credit Cards</b>) : "Credit Cards"}
                    </Link>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default UserProfilePage;