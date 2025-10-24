import React, { useEffect, useState } from "react";
import "../../styles/RestaurantPaginationFilterSort.scss"
import { fetchPaginatedFilteredAndSortedRestaurants, fetchRestaurantSortType } from "../../services/RestaurantService";
import SortTypeDropdown from "../sharedComponents/SortTypeDropdown";
import FilterSection from "../sharedComponents/FilterSection";
import PagionationSection from "../sharedComponents/PaginationSection";
import { useNavigate } from "react-router-dom";
import RatingComponent from "../sharedComponents/RatingComponent";
import { PeopleAlt, } from "@mui/icons-material";
import Spinner from "../sharedComponents/Spiner";
import ErrorPopup from "./Popups/ErrorPopup";


const RestaurantPaginationFilterSort = () => {
    const [restaurants, setRestaurants] = useState(null);
    const [sortTypes, setSortTypes] = useState([]);
    const [chosenSortType, setChosenSortType] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [totalRowsCount, setTotalRowsCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [chosenFilters, setChosenFilters] = useState({
        name: null,
        city: null,
        capacityFrom: null,
        capacityTo: null,
        averageRatingFrom: null,
        averageRatingTo: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => setShowError(false);

    const navigate = useNavigate();

    const getRestaurantsPage = async () => {
        try {
            setIsLoading(true)
            const data = await fetchPaginatedFilteredAndSortedRestaurants(chosenFilters, chosenSortType, page + 1, pageSize)
            setRestaurants(data.items);
            setTotalRowsCount(data.totalRowsCount);
            setHasPreviousPage(data.hasPreviousPage);
            setHasNextPage(data.hasNextPage);

            setIsLoading(false);
        } catch (error) {
            if (error.status) {
                if (error.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.")
                    setShowError(true);
                } else {
                    setErrorMessage(`Error: ${error.status}`);
                    setShowError(true);
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");
                setShowError(true);

            } else {
                setErrorMessage("Something went wrong. Please try again.");
                setShowError(true);
            }
            console.log(`An error occured while creating Customer:`, error);
            setIsLoading(false);
        }
    }


    const getRestaurantSortType = async () => {
        try {
            const restaurantSortTypeFromDb = await fetchRestaurantSortType();
            setSortTypes(restaurantSortTypeFromDb);
        } catch (error) {
            console.error(error.message);
        }
    }
    const handleSortTypeChange = (sortType) => {
        setChosenSortType(sortType);
    }

    const filterRestaurants = (chosenFilters) => {
        setChosenFilters(chosenFilters)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(parseInt(newPageSize));
        setPage(0);
    };

    const handleCardClick = (id) => {
        navigate(`restaurant-menu/${id}`)
    }

    useEffect(() => {
        getRestaurantSortType();
    }, []);

    useEffect(() => {
        getRestaurantsPage();
    }, [chosenFilters, chosenSortType, page, pageSize]);

    if (showError) {
        return (
            <ErrorPopup message={errorMessage} onClose={handleCloseError} />
        )
    }

    return (
        <div className="RestaurantPaginationFilterSort-pageContainer">
            <div className="RestaurantPaginationFilterSort-main">
                <h1 className="restaurants-title">Restaurants</h1>
                <div className="sortAndFilter-container">
                    <SortTypeDropdown onSortTypeChange={handleSortTypeChange} sortTypes={sortTypes} />
                    <FilterSection onFilter={filterRestaurants} />
                </div>

                <div className="restaurants-container">
                    {restaurants ? restaurants.length > 0 ? (restaurants.map(restaurant =>
                        <div key={restaurant.id} className="restaurant-card" onClick={() => handleCardClick(restaurant.id)}>
                            <div className="img-section">
                                <img id="restaurant-img" src={restaurant.restaurantImageUrl} alt="Restaurant picture" />
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
                    )) : (
                        <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
                            <h3 className="no-restaurants-found">
                                Sorry, no restaurants match your search criteria.
                            </h3>
                        </div>
                    ) : (<div> <Spinner /></div>)}
                </div>

            </div>

            <PagionationSection onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                totalRowsCount={totalRowsCount}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                page={page}
                pageSize={pageSize}
            />
        </div>
    )
}
export default RestaurantPaginationFilterSort;