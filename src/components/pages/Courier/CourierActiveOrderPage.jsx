import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../../styles/courierOrderPage.scss"
import { fetchCourierActiveOrder, updateCourierActiveOrder } from "../../../services/OrderService";
import ErrorPopup from "../Popups/ErrorPopup";
import Spinner from "../../sharedComponents/Spiner";
import { useNavigate } from "react-router-dom";

const CourierActiveOrderPage = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const getCourierActiveOrder = async () => {
        try {
            setIsLoading(true);
            const courierActiveOrder = await fetchCourierActiveOrder(user.id);
            setActiveOrder(courierActiveOrder);
            console.log(courierActiveOrder)
            setIsLoading(false);
        } catch (error) {
            if (error.status) {
                if (error.status === 404) {
                    console.log(`Courier with Id: ${user.id} currently have no assigned orders.`);
                } else if (error.status === 500) {
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
            setIsLoading(false);
        }
    }

    const updateActiveOrderForCourier = async (data) => {
        try {
            setIsLoading(true);
            const updatedOrder = await updateCourierActiveOrder(activeOrder.id, user.id, data);
            setActiveOrder(updatedOrder);
            setIsLoading(false);
        } catch (error) {
            if (error.status) {
                if (error.status === 400) {
                    setErrorMessage(`${error.status.message}`);
                } else if (error.status === 403) {
                    setErrorMessage(`You are not authorized to update order with ID: ${activeOrder.id}.`);
                } else if (error.status === 404) {
                    setErrorMessage(`Order with Id: ${activeOrder.id} not found.`);
                } else if (error.status === 500) {
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
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCourierActiveOrder();
    }, [])

    useEffect(() => {
        if (activeOrder?.status?.toLowerCase() === "delivered") {
            setActiveOrder(null);
        }
    }, [activeOrder]);



    const handleOrderDelivery = () => {
        updateActiveOrderForCourier({ newStatus: "Delivered" })
    }

    const handleOrderPickup = () => {
        updateActiveOrderForCourier({ newStatus: "DeliveryInProgress" })
    }

    const handleClose = () => {
        navigate("/courier");
        setErrorMessage("")
    }

    if (errorMessage) {
        return (
            <ErrorPopup message={errorMessage} onClose={handleClose} />
        )
    }

    const normalizedStatus = activeOrder?.status?.toString().trim().toLowerCase();


    return (
        <div className="order-container">
            {isLoading ? (
                <Spinner />
            ) : activeOrder ? (
                <div className="order-card">
                    <h3 className="card-header-title">
                        Active order for courier: {activeOrder?.courier.name} {activeOrder?.courier.surname}
                    </h3>

                    <div className="line-wrapper">
                        <div className="fade-line"></div>
                    </div>

                    <div className="card-content">
                        <div className="card-content-text">
                            <b>Restaurant:</b> {activeOrder?.restaurantName}
                        </div>
                        <div className="card-content-text">
                            <b>Delivery Address:</b> {activeOrder?.deliveryAddress.street} {activeOrder?.deliveryAddress.streetNumber}, {activeOrder?.deliveryAddress.zipCode} {activeOrder?.deliveryAddress.city}
                        </div>
                        <div className="card-content-text">
                            <b>Ordered items:</b>
                            {activeOrder?.orderItems.map((item, index) => (
                                <div key={index} className="ordered-item">
                                    <span className="item-name"><b>Item:</b> {item.mealName}</span>
                                    <span className="item-quantity"><b>Quantity:</b> {item.quantity}</span>
                                </div>
                            ))}
                        </div>


                        <div className="card-content-text">
                            <b>Customer:</b> {activeOrder?.customerName}
                        </div>
                        <div className="card-content-text">
                            <b>Status:</b> {
                                normalizedStatus === "pickupinprogress"
                                    ? "Pickup in progress"
                                    : normalizedStatus === "deliveryinprogress"
                                        ? "Delivery in progress"
                                        : normalizedStatus === "delivered"
                                            ? "Delivered"
                                            : "Unknown"
                            }
                        </div>
                    </div>

                    <div className="card-button-section">
                        {normalizedStatus === "pickupinprogress" && (
                            <button className="pickedupBtn" onClick={handleOrderPickup}>
                                Mark as picked up
                            </button>
                        )}
                        {normalizedStatus === "deliveryinprogress" && (
                            <button className="confirmBtn" onClick={handleOrderDelivery}>
                                Confirm Delivery
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="no-order-message">
                    <h3>You currently have no assigned orders.</h3>
                </div>
            )}
        </div>
    );
}
export default CourierActiveOrderPage;