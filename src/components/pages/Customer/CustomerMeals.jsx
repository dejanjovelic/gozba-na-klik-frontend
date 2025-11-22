import React, { useContext, useEffect, useState } from "react";
import '../../../styles/customerMeals.scss';
import GlobalSearchSection from "../../sharedComponents/GlobalSearchSection";
import PagionationSection from "../../sharedComponents/PaginationSection";
import { getCustomerAllergens } from "../../../services/CustomerService";
import { fetchFilteredMeals } from "../../../services/MealsService";
import Spinner from "../../sharedComponents/Spinner";
import { FormControlLabel, Switch } from "@mui/material";
import MultipleSelectCheckmarksComponent from "../../sharedComponents/MultipleSelectCheckmarksComponent";
import { useNavigate } from "react-router-dom";
import ErrorPopup from "../Popups/ErrorPopup";
import UserContext from "../../../config/UserContext";

const CustomerMeals = () => {
    const [meals, setMeals] = useState([]);
    const [allAllergens, setAllAllergens] = useState([]);
    const [customerAllergens, setCustomerAllergens] = useState([]);
    const [additionalAllergensIds, setAdditionalAllergensIds] = useState([]);
    const [query, setQuery] = useState('');
    const [hideMealsWithAllergens, setHideMealsWithAllergens] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [totalRowsCount, setTotalRowsCount] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const {user} = useContext(UserContext);


    const handleQueryChange = (newQuery) => {
        setQuery(newQuery);
    }

    const handleHideMealsWithAllergensChange = () => {
        setHideMealsWithAllergens(!hideMealsWithAllergens);
        console.log(hideMealsWithAllergens);
    }

    const handleAdditionalAllergens = (newAdditionalAllergensIds) => {
        setAdditionalAllergensIds(newAdditionalAllergensIds);
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(parseInt(newPageSize));
        setPage(0);
    };

    const handleMealCardClick = (restaurantId, mealId) => {
        navigate(`/restaurant-menu/${restaurantId}`, {
            state: { selectedMealId: mealId }
        });
    }

    const handleErrorPopupClose = () => {
        navigate("/customer");
    }

    const reqBody = {
        customerId: user.id,
        hideMealsWithAllergens: hideMealsWithAllergens,
        additionalAllergensIds: additionalAllergensIds,
        query: query
    }


    const getFilteredMeals = async () => {
        try {
            const filteredPaginateMeals = await fetchFilteredMeals(reqBody, page + 1, pageSize);
            setMeals(filteredPaginateMeals.meals.items);
            setTotalRowsCount(filteredPaginateMeals.meals.totalRowsCount);
            setHasNextPage(filteredPaginateMeals.meals.hasNextPage);
            setHasPreviousPage(filteredPaginateMeals.meals.hasPreviousPage);
            setAllAllergens(filteredPaginateMeals.allAllergens);
        } catch (error) {
            if (error.status) {
                if (error.status === 404) {
                    const backendMessage = error.response.data?.error || "Resource not found.";
                    setErrorMessage(backendMessage);
                } else if (error.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.")
                } else {
                    setErrorMessage(`Error: ${error.status}`);
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");

            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            setShowError(true);
            console.log(`An error occured while creating Customer:`, error);
            setIsLoading(false);
        }
    }


    const fetchCustomerAllegrens = async () => {
        try {
            const customerAllergensFromDb = await getCustomerAllergens(user.id);
            setCustomerAllergens(customerAllergensFromDb);
        } catch (error) {

            if (error.status) {
                if (error.status === 404) {
                    setErrorMessage(`Customer with ${user.id} ${user.name} not found`);
                } else if (error.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.")
                } else {
                    setErrorMessage(`Error: ${error.status}`);
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");

            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            setShowError(true);
            console.log(`An error occured while creating Customer:`, error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const onMounting = async () => {
            setIsLoading(true);
            await getFilteredMeals();
            await fetchCustomerAllegrens();
            setIsLoading(false);
        }
        onMounting();
    }, [])

    useEffect(() => {
        getFilteredMeals();
        fetchCustomerAllegrens();
    }, [additionalAllergensIds, hideMealsWithAllergens, page, pageSize, hasNextPage, hasPreviousPage, query]);

    if (showError) {
        return (
            <ErrorPopup message={errorMessage} onClose={handleErrorPopupClose} />
        );
    }

    return (
        <>
            <div className="customerPaginationMeals-container">
                <div className="customerPaginationMeals-main">
                    <GlobalSearchSection onQueryChange={handleQueryChange} />
                    <h1 className="customerMeals-title">Meals</h1>
                    <div className="switchSelect-container">
                        <div className="switch-container">
                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={handleHideMealsWithAllergensChange}
                                        slotProps={{
                                            input: { 'aria-label': 'controlled' }
                                        }}
                                    />
                                }
                                label="  Hide meals with selected allergens"
                            />
                        </div>

                        <div className="allergenSelection-container">
                            <MultipleSelectCheckmarksComponent allAllergens={allAllergens} onChange={handleAdditionalAllergens} customerAllergens={customerAllergens} />
                        </div>
                    </div>
                    <div className="customerMealsFilter-container">

                    </div>
                    <div className="customerMeals-container">
                        {isLoading ? (<div><Spinner /></div>) :
                            (meals ? (meals.map(meal => {
                                return (
                                    <div key={meal.id} className="customerMeal-card" onClick={() => handleMealCardClick(meal.restaurantId, meal.id)}>

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
                                            <img id="customerMealImage"
                                                src={meal.mealImageUrl}
                                                alt="Meal image"
                                            />
                                            <button id="add-meal-to-cart">+</button>
                                        </div>

                                    </div>
                                )

                            })) : (<p>No meals found.</p>
                            ))}

                    </div>

                </div>
                <PagionationSection
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    page={page}
                    pageSize={pageSize}
                    totalRowsCount={totalRowsCount}
                />
            </div>

        </>
    );

}
export default CustomerMeals;