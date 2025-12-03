import React, { useState } from "react";
import RestaurantCardSliderPauseOnHover from "../../sharedComponents/RestaurantCardSliderPauseOnHover";
import "../../../styles/customerHomePage.scss"
import MealsCardSliderPauseOnHover from "../../sharedComponents/MealsCardSliderPauseOnHover";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../Popups/ErrorPopup";

const CustomerHomePage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleClose = () => {
        navigate("/");
        setErrorMessage("")
    }

    return (
        <div className="customer-home-page-conatiner">
          
                <>
                    <h1 onClick={() => navigate("/")}>Restaurants</h1>
                    <RestaurantCardSliderPauseOnHover
                        setErrorMessage={setErrorMessage}
                    />

                    <h1 onClick={() => navigate("/customer/meals")}>Meals</h1>
                    <MealsCardSliderPauseOnHover
                        setErrorMessage={setErrorMessage}
                    />
                </>
            {errorMessage && (
                <ErrorPopup message={errorMessage} onClose={handleClose} />
            )}
        </div>

    );

}
export default CustomerHomePage;