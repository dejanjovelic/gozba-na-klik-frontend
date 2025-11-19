import React, { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../OrderContext";
import { getAddresses } from "../../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import { cancelOrder, createOrder } from "../../../services/OrderService";
import ErrorPopup from "../Popups/ErrorPopup";
import SucessPopup from "../Popups/SucessPopup";
import ConfirmationPopup from "../Popups/ConfirmationPopup";

const RestaurantBasket = () => {
    const { state, dispatch } = useContext(OrderContext);
    const user = JSON.parse(sessionStorage.getItem("user") || "null");
    const [addresses, setAddresses] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccesMessage] = useState(false);
    const [showAllergenConfirmation, setShowAllergenConfirmation] = useState(false);
    const [allergenConfirmationMessage, setAllergenConfirmationMessage] = useState("");
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
    const [orderConfirmationMessage, setOrderConfirmationMessage] = useState("");
    const [orderId, setOrderId] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const handleCloseError = () => setShowError(false);
    const handleCloseSuccess = () => setSucsessMessage(false);
    const navigate = useNavigate();

    const total = state.items.reduce((s, x) => s + x.price, 0) + (state.items.length > 0 ? 200 : 0);

    const groupedItems = state.items.reduce((accumulator, item) => {
        const existing = accumulator.find(i => i.id === item.id)
        if (existing) {
            existing.quantity += 1
        } else {
            accumulator.push({ ...item, quantity: 1 });
        }
        return accumulator;
    }, []);

    const handleAllergenConfirmYes = async () => {
        setShowAllergenConfirmation(false);
        setSuccesMessage("Order successfully confirmed")
        dispatch({ type: "CLEAR_ORDER" });

        setInterval(() => {
            setSuccesMessage("");
        }, 2000);
    };

    const handleAllergenConfirmNo = (id) => {
        setShowAllergenConfirmation(false);
        cancelOrder(id);

        setSuccesMessage("Order successfully cancelled");
        dispatch({ type: "CLEAR_ORDER" });

        setInterval(() => {
            setSuccesMessage("");
        }, 2000);
    }

    async function loadAddresses() {
        setIsLoading(true);
        try {
            const data = await getAddresses(user.id);
            setAddresses(data);
        }
        catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching Addresses:", error);
            setShowError(true);
            setIsLoading(false);
        } finally {
            setInterval(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const handleAddressChange = (e) => {
        dispatch({ type: "SET_ADDRESS", payload: parseInt(e.target.value) });
    };

    const handleCheckout = () => {
        if (groupedItems.length === 0) {
            setErrorMessage("Your basket is empty!");
            setShowError(true);
            return;
        }
        if (!state.deliveryAddressId) {
            setErrorMessage("Please select a delivery address!");
            setShowError(true);
            return;
        }

        setOrderConfirmationMessage("Are you sure you want to place this order?");
        setShowOrderConfirmation(true);
    };

    const cancelCheckout = () => {
        setShowOrderConfirmation(false);
    };

    const confirmOrder = async () => {
        setShowOrderConfirmation(false);
        setIsLoading(true);

        const orderDto = {
            customerId: user.id,
            restaurantId: state.restaurantId,
            deliveryAddressId: state.deliveryAddressId,
            items: groupedItems.map(item => ({
                mealId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await createOrder(orderDto);
            setOrderId(response.orderId);

            if (response.requiresAllergenWarn) {
                setAllergenConfirmationMessage(
                    "Selected meals contain allergens. Are you sure you want to proceed?"
                );
                setShowAllergenConfirmation(true);
                return;
            }

            dispatch({ type: "CLEAR_ORDER" });
            setSuccesMessage("Order successfully placed!");
        } catch (error) {
            let message = "Something went wrong. Please try again.";

            if (error.response) {
                const status = error.response.status;
                const dataMessage = error.response.data?.error;

                if (status === 500) {
                    message = "We're experiencing technical difficulties. Please try again shortly.";
                } else if (status === 400) {
                    message = dataMessage || "Bad request. Please check your input.";
                } else {
                    message = dataMessage || message;
                }

            } else if (error.request) {
                message = "The server seems to be taking too long to respond. Please try again in a moment.";
            }

            setErrorMessage(message);
            setShowError(true);
            console.log("An error occurred while creating Order:", error);
            setIsLoading(false);
        } finally {
            setInterval(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    useEffect(() => {
        if (addresses?.length > 0 && !state.deliveryAddressId) {
            dispatch({ type: "SET_ADDRESS", payload: addresses[0].id });
        }
    }, [addresses]);

    return (
        <div className="basket-container">
            <h3>Your order</h3>

            {groupedItems.length === 0 ? (
                <p>No items yet</p>
            ) : (
                groupedItems.map((meal, index) => (
                    <div key={index}>
                        <hr />
                        <div className="basket-item">
                            <p>{meal.mealName} {meal.quantity}x</p>
                            <p>{meal.price * meal.quantity}RSD</p>
                        </div>
                    </div>
                ))
            )}

            <hr />
            <label htmlFor="addressSelect">Deliver to:</label>
            {addresses?.length > 0 ?
                <select
                    id="addressSelect"
                    value={state.deliveryAddressId || ""}
                    onChange={handleAddressChange}
                >
                    {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                            {addr.street} {addr.streetNumber}, {addr.city}
                        </option>
                    ))}
                </select> : <p>
                    You don't have any saved address,{" "}
                    <span className="link" onClick={() => navigate("/customer/addresses")}>
                        click here to create one
                    </span>
                </p>}
            <br />
            <p>Delivery fee: {state.items.length > 0 ? `200` : `0`}RSD</p>



            <hr />

            <p className="basket-total">
                <strong>Total:</strong> {total}RSD
            </p>

            <button id="checkout-btn" onClick={handleCheckout}>{isLoading ? <span className="spinner"></span> : "Checkout"}</button>
            {successMessage && (
                <SucessPopup
                    message={successMessage}
                    timeOut={2}
                    onClose={() => handleCloseSuccess()}
                />
            )}
            {showAllergenConfirmation && (
                <ConfirmationPopup
                    message={allergenConfirmationMessage}
                    onYes={handleAllergenConfirmYes}
                    onNo={() => handleAllergenConfirmNo(orderId)}
                />
            )}
            {showOrderConfirmation && (
                <ConfirmationPopup
                    message={orderConfirmationMessage}
                    onYes={confirmOrder}
                    onNo={cancelCheckout}
                />
            )}
            {showError && <ErrorPopup message={errorMessage} onClose={handleCloseError} />}
        </div>
    );
}

export default RestaurantBasket;
