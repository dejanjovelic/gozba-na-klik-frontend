import React, { useContext, useEffect, useState } from "react";
import "../../styles/RestaurantOwnerRestaurantsStyle.scss";
import { fetchAllRestaurantsFromOwner } from "../../../Restaurant/services/RestaurantService";
import UserContext from "../../../../shared/context/UserContext";
import { TooltipWrapper } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import HandleError from "../../../../shared/components/HandleError";

const RestaurantOwnerRestaurants = () => {
  const { user } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role.toLowerCase().trim() !== "restaurantowner") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchRestaurantsFromDb = async () => {
    try {
      const restaurantsFromDb = await fetchAllRestaurantsFromOwner(user.id);
      setRestaurants(restaurantsFromDb);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        entity: "restaurants"
      });
    }
  };

  useEffect(() => {
    fetchRestaurantsFromDb();
  }, []);

  const handleEdit = (restaurantId) => {
    navigate(`${restaurantId}/edit`);
  };

  return (
    <div className="restaurant-owner-restaurants-page-container">
      <div className="restaurant-owner-restaurants-page-title-warpper">
        <h2 className="restaurant-owner-restaurants-page-title">Restaurants</h2>
      </div>
      <div className="restaurant-owner-restaurants-page-wrapper">
        {restaurants
          ? restaurants.map((restaurant) => {
              return (
                <div
                  className="restaurant-owner-restaurants-page-restaurat-card"
                  key={restaurant.id}
                >
                  <div className="restaurant-owner-restaurants-page-restaurant-card-content">
                    <div className="restaurant-owner-restaurants-page-restaurant-card-left-side">
                      <img
                        className="restaurant-owner-restaurants-page-image"
                        src={
                          restaurant.restaurantImageUrl
                            ? restaurant.restaurantImageUrl
                            : null
                        }
                        alt="Restaurant image"
                      />
                    </div>
                    <div className="restaurant-owner-restaurants-page-restaurant-card-right-side">
                      <h2>{restaurant.name}</h2>
                      <p>
                        Address: {restaurant.address ? restaurant.address : ""}
                      </p>
                      <p>City: {restaurant.city}</p>
                      <p>
                        Status:
                        <span
                          className={`restaurant-owner-restaurant-page-status-${restaurant.isCreated ? "published" : "pending"}`}
                        >
                          {restaurant.isCreated ? " Published" : " Pending"}
                        </span>
                      </p>
                      <p>
                        Average rating:{" "}
                        {restaurant.averageRating == 0
                          ? "not rated"
                          : restaurant.averageRating}
                      </p>
                      <div className="restaurant-owner-restaurants-page-edit-button-wrapper">
                        <button
                          className="restaurant-owner-restaurants-page-edit-button positive-action"
                          onClick={() => handleEdit(restaurant.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : restaurants.length === 0 && (
              <div className="restaurant-owner-restaurants-page-noresturants-message-Wrapper">
                <h2 className="restaurant-owner-restaurants-page-noresturants-message">
                  You don't have any restaurants.
                </h2>
              </div>
            )}
      </div>
    </div>
  );
};
export default RestaurantOwnerRestaurants;
