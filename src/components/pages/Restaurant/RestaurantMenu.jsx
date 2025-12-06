import React, { useContext, useEffect, useState } from "react";
import { getRestaurantWithMeals } from "../../../services/RestaurantService";
import "../../../styles/restaurantMenu.scss";
import RatingComponent from "../../sharedComponents/RatingComponent";
import { PeopleAlt } from "@mui/icons-material";
import { getCustomerAllergens } from "../../../services/CustomerService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Spiner from "../../sharedComponents/Spinner";
import ErrorPopup from "../Popups/ErrorPopup";
import RestaurantBasket from "./RestaurantBasket";
import { OrderContext } from "../../OrderContext";
import UserContext from "../../../config/UserContext";
import RestaurantReviewsModal from "./RestaurantReviewsModal";
import { fetchRestaurantReviewsPaginated } from "../../../services/OrderReviewService";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MapPin } from "lucide-react";

const RestaurantMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewsPage, setReviewsPage] = useState(0);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [customerAllergens, setCustomerAllergens] = useState(null);
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const location = useLocation();
  const selectedMeal = location.state?.selectedMealId || null;
  const { dispatch } = useContext(OrderContext);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const handleCloseError = () => setShowError(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const restaurant = await getRestaurantWithMeals(id);
      setRestaurant(restaurant);

      await loadReviews();

      if (user) {
        const customerAllergensData = await getCustomerAllergens(user.id);
        setCustomerAllergens(customerAllergensData);

        dispatch({ type: "SET_RESTAURANT", payload: restaurant.id });
        dispatch({ type: "SET_CUSTOMER", payload: user.id });
      }
    } catch (error) {
      if (error.status) {
        if (error.status === 500) {
          setErrorMessage(
            "Server is temporarily unavailable. Please refresh or try again later."
          );
          setShowError(true);
        } else {
          setErrorMessage(`Error: ${error.status}`);
          setShowError(true);
        }
      } else if (error.request) {
        setErrorMessage(
          "The server is not responding. Please try again later."
        );
        setShowError(true);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        setShowError(true);
      }
      console.log(`An error occured while fetching data:`, error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRestaurantReviewsPaginated(id, reviewsPage + 1);

      setReviews(data);
      setTotalReviewsCount(data.totalRowsCount);
    } catch (error) {
      if (error.status && error.status === 500) {
        setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
      } else if (error.request) {
        setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      console.log("An error occurred while fetching restaurant reviews:", error);
      setShowError(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (showError) {
    return <ErrorPopup message={errorMessage} onClose={handleCloseError} />;
  }

  if (isLoading) {
    return <Spiner />;
  }

  return (
    <div className="restaurant-container">
      <div className="restaurant-container-left">
        {restaurant && (
          <>
            <div className="restaurant-div">
              <div id="restaurant-middle-section">
                <img
                  id="restaurant-image"
                  src={restaurant.restaurantImageUrl}
                  alt="Restaurant image"
                />
              </div>
              <div id="restaurant-upper-section">
                <h2>{restaurant.name}</h2>
                <span onClick={totalReviewsCount > 0 ? () => setShowReviewsModal(true) : undefined} style={{ cursor: totalReviewsCount > 0 ? "pointer" : "default" }}>
                  <RatingComponent rating={restaurant.averageRating} /> <span>({totalReviewsCount}) <MdOutlineKeyboardArrowRight id="reviews-arrow-right" /></span>
                </span>
                <p id="restaurant-capacity">
                  {restaurant.capacity} <PeopleAlt />
                </p>
                <p id="restaurant-address">
                  <MapPin />{restaurant.address}, {restaurant.city}
                </p>
              </div>

              <div id="restaurant-bottom-section">
                <p id="restaurant-desc">{restaurant.description}</p>
              </div>
            </div>
            <div className="meals-container">
              <h2>Menu</h2>
              <div className="meals-div">
                {restaurant.mealsOnMenu.map((meal) => (
                  <div key={meal.id} className={`meal-card ${meal.id === selectedMeal ? 'selected' : ''}`}>
                    <div className="meal-data">
                      <div>
                        <p>{meal.mealName}</p>
                        <p id="meal-desc">{meal.description}</p>
                        {meal.allergens.length > 0 && (
                          <p>
                            Allergens:{" "}
                            {meal.allergens.map((a, index) => {
                              const hasMatch = customerAllergens?.some(
                                (ca) => ca.id == a.id
                              );
                              return (
                                <span
                                  key={a.id}
                                  style={{ color: hasMatch ? "red" : "black" }}
                                >
                                  {a.name}
                                  {index < meal.allergens.length - 1 && ", "}
                                </span>
                              );
                            })}
                          </p>
                        )}
                      </div>
                      <p id="meal-price">{meal.price} €</p>
                    </div>
                    <div className="meal-image">
                      <img src={meal.mealImageUrl} alt="Meal image" />
                      {user &&
                        <button id="add-meal-to-cart" onClick={() =>
                          dispatch({
                            type: "ADD_ITEM",
                            payload: {
                              id: meal.id,
                              mealName: meal.mealName,
                              price: meal.price,
                              allergens: meal.allergens,
                              mealImageUrl: meal.mealImageUrl,
                            },
                          })
                        }>+</button>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
      {user &&
        <div className="basket-placeholder">
          <RestaurantBasket />
        </div>
      }

      {showReviewsModal && (
        <RestaurantReviewsModal
          reviews={reviews}
          onClose={() => setShowReviewsModal(false)}
          handlePageChange={(newPage) => {
            setReviewsPage(newPage);
            loadReviews(newPage);
          }}
        />
      )}
    </div>
  );
};

export default RestaurantMenu;
