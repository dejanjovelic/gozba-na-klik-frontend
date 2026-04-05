import React, { useEffect, useState } from "react";
import { deleteRestaurant, fetchAllRestaurants } from "../../../services/RestaurantService";
import "../../../styles/adminRestaurantsPage.scss";
import ConfirmationPopup from "../Popups/ConfirmationPopup";

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [restaurantId, setRestaurantId] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantsFromDb = await fetchAllRestaurants();
                setRestaurants(restaurantsFromDb);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };
        fetchData();
    }, []);

    const handleEditRestaurant = () => {

    }

    const handleDeleteRestaurant = (id) => {
        setOpenModal(true);
        setRestaurantId(id);
    }

    const deleteRestaurantAction = async () => {
        try {
            await deleteRestaurant(restaurantId);
            setRestaurantId(null);
            setOpenModal(false);
        } catch (error) {
            console.error("greska:", error)
        }
    }

    return (
        <div className="admin-restaurant-page-container">
            <h1>Restaurants</h1>
            <div
                className="admin-restaurant-add-button positive-action"
            >
                Add Restaurant
            </div>
            <div className="adimn-restaurants-page-table-wrapper">
                <table className="admin-restaurants-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Capacity</th>
                            <th>Average Rating</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.length > 0 &&
                            restaurants.map((restaurant) => (
                                <tr key={restaurant.id}>
                                    <td>{restaurant.name}</td>
                                    <td>{restaurant.address}</td>
                                    <td>{restaurant.city}</td>
                                    <td>{restaurant.capacity}</td>
                                    <td>{restaurant.averageRating}</td>
                                    <td>
                                        <button
                                            className="admin-restaurant-edit-button positive-action"
                                            onClick={handleEditRestaurant}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="admin-restaurant-delete-button negative-action"
                                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                {openModal &&
                    <ConfirmationPopup
                        message={"Are you sure you want delete restaurant?"}
                        onYes={deleteRestaurantAction}
                        onNo={() => setOpenModal(false)}
                    />
                }
            </div>
        </div>
    );
}
export default AdminRestaurants;