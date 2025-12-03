import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchTopRatedRestaurants } from "../../services/RestaurantService";
import { useNavigate } from "react-router-dom";
import RatingComponent from "./RatingComponent";
import { PeopleAlt } from "@mui/icons-material";
import Spinner from "./Spinner";

function RestaurantCardSliderPauseOnHover({ setErrorMessage }) {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  var settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    pauseOnHover: true
  };

  const getTopRatedRestaurants = async () => {
    try {
      const topRatedRestaurants = await fetchTopRatedRestaurants();
      setRestaurants(topRatedRestaurants)
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
    getTopRatedRestaurants()
  }, [])

  return (
    <div className="restaurants-slider-container">
      {isLoading ? (
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
  );
}

export default RestaurantCardSliderPauseOnHover;