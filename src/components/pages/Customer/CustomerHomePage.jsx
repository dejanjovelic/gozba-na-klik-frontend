import React, { useContext, useEffect, useState } from "react";
import "../../../styles/customerHomePage.scss";
import { useNavigate } from "react-router-dom";
const CustomerHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="HomepageContainer">
      <div
        className="restaurantAdvertisementContainer"
        onClick={() => navigate("/")}
      >
        <h2>Checkout our restaurants!</h2>

        <br />
      </div>
      <div
        className="mealsAdvertisementContainer"
        onClick={() => navigate("/customer/meals")}
      >
        <h2>Checkout our meals!</h2>

        <br />
      </div>
    </div>
  );
};
export default CustomerHomePage;
