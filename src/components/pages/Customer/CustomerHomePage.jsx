import React, { useState, useEffect } from "react";
import "../../../styles/customerHomePage.scss"
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import ErrorPopup from "../Popups/ErrorPopup.jsx";
import { fetchAllMeals } from "../../../services/MealsService";
import Spinner from "../../sharedComponents/Spinner.jsx";
import { fetchTopRatedRestaurants } from "../../../services/RestaurantService";
import RatingComponent from "../../sharedComponents/RatingComponent.jsx";
import { PeopleAlt } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomerHomePage = () => {
    const [meals, setMeals] = useState([]);
    const [mealsLoading, setMealsLoading] = useState(true);

    const [restaurants, setRestaurants] = useState([]);
    const [restaurantsLoading, setRestaurantsLoading] = useState(true);

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');


    var settings = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        pauseOnHover: true
    };


    useEffect(() => {
        let isActive = true;
        const loadMeals = async () => {
            try {
                const mealsFromDb = await fetchAllMeals();
                if (isActive) setMeals(mealsFromDb);
            } catch (error) {
                if (error?.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.");
                } else if (error?.status) {
                    setErrorMessage(`Error: ${error.status}`);
                } else if (error?.request) {
                    setErrorMessage("The server is not responding. Please try again later.");
                } else {
                    setErrorMessage("Something went wrong. Please try again.");
                }
                console.log("Error fetching meals:", error);
            }
            finally {
                if (isActive) setMealsLoading(false);
            }
        }

        const loadRestaurants = async () => {
            try {
                const topRatedRestaurants = await fetchTopRatedRestaurants();
                if (isActive) setRestaurants(topRatedRestaurants);
            } catch (error) {
                if (error?.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.");
                } else if (error?.status) {
                    setErrorMessage(`Error: ${error.status}`);
                } else if (error?.request) {
                    setErrorMessage("The server is not responding. Please try again later.");
                } else {
                    setErrorMessage("Something went wrong. Please try again.");
                }
                console.log("Error fetching restaurants:", error);
            }
            finally {
                if (isActive) setRestaurantsLoading(false);
            }
        }
        loadRestaurants();
        loadMeals();
        return () => { isActive = false };
    }, []);

    const handleClose = () => {
        navigate("/");
        setErrorMessage("")
    }

    return (
        <div className="customer-home-page-conatiner">

            <h1 onClick={() => navigate("/")}>Restaurants</h1>
            <div className="restaurants-slider-container">
                {restaurantsLoading ? (
                    <Spinner />
                ) :
                    (restaurants?.length > 0 ? (
                        <Slider {...settings}>
                            {restaurants?.map(restaurant => {
                                return (
                                    <div key={restaurant.id} className="restaurant-card customer-page" onClick={() => navigate(`/restaurant-menu/${restaurant.id}`)}>
                                        <div className="img-section">
                                            <div className="restaurant-img">
                                                <img id="restaurant-img" src={restaurant.restaurantImageUrl} alt="Restaurant photo" />
                                            </div>
                                        </div>
                                        <div className="restaurantData-section">
                                            <div className="restaurantData-section-leftSide">
                                                <h2 className="restaurant-name">{restaurant.name}</h2>
                                                <span><RatingComponent rating={restaurant.averageRating} /></span>
                                            </div>
                                            <div className="restaurantData-section-rightSide">
                                                <p>{restaurant.city}</p>
                                                <p className="restaurantData-capacity">{restaurant.capacity}
                                                    <PeopleAlt sx={{ ml: 1, position: 'relative', top: 5 }} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>) : (
                        <div className="no-resturants-message-wrapper">
                            <h2> No restaurants available</h2>
                        </div>
                    ))}
            </div>

            <h1 onClick={() => navigate("/customer/meals")}>Meals</h1>
            <div className="meals-slider-container">
                {mealsLoading ? (
                    <Spinner />
                ) :
                    (meals?.length > 0 ? (
                        <Slider {...settings}>
                            {meals.map(meal => (
                                <div
                                    key={meal.id}
                                    className="customerMeal-card customer-page"
                                    onClick={() => navigate(`/restaurant-menu/${meal.restaurantId}`)}
                                >
                                    <div className="customerMealData-section">
                                        <h2 className="customerMeal-name">{meal.mealName}</h2>
                                        <div className="customerMeal-description">{meal.description}</div>
                                        <div className="customerMeal-allergens">
                                            Allergens:{' '}
                                            {meal.allergens.map((allergen, index) => (
                                                <span
                                                    key={allergen.id}
                                                    style={{ color: allergen.isCustomerAllergen ? 'red' : 'inherit' }}
                                                >
                                                    {allergen.name}
                                                    {index < meal.allergens.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="customerMeal-price"><b>{meal.price} €</b></div>
                                    </div>

                                    <div className="customerMealImage-section">
                                        <img
                                            id="customerMealImage"
                                            src={meal.mealImageUrl}
                                            alt="Meal image"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="no-meals-message-wrapper">
                            <h2>No meals available</h2>
                        </div>
                    ))}
            </div>
            {
                errorMessage && (
                    <ErrorPopup message={errorMessage} onClose={handleClose} />
                )
            }
        </div >

    );

}
export default CustomerHomePage;