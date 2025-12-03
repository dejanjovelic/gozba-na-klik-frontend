import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchAllMeals } from "../../services/MealsService";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const MealsCardSliderPauseOnHover = ({ setErrorMessage }) => {
    const [meals, setMeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


    var settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        pauseOnHover: true
    };

    const getAllMeals = async () => {
        try {
            const mealsFromDb = await fetchAllMeals();
            setMeals(mealsFromDb);

        } catch (error) {
            if (error.status) {
                if (error.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.");
                } else {
                    setErrorMessage(`Error: ${error.status}`);
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log(`An error occured while creating Customer:`, error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAllMeals();
    }, []);


    return (
        <div className="meals-slider-container">

            {isLoading ? (
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
                                    <div className="customerMeal-price">{meal.price} eur</div>
                                </div>

                                <div className="customerMealImage-section">
                                    <img
                                        id="customerMealImage"
                                        src={meal.mealImageUrl}
                                        alt="Meal image"
                                    />
                                    <button id="add-meal-to-cart">+</button>
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
    );
}
export default MealsCardSliderPauseOnHover;