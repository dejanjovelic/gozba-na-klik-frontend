import React, { useEffect, useState } from "react";
import { deleteRestaurant, fetchAllRestaurants, fetchDaysOfTheWeek } from "../../../services/RestaurantService";
import "../../../styles/adminRestaurantsPage.scss";
import ConfirmationPopup from "../Popups/ConfirmationPopup";
import { fetchAllRestaurantOwners } from "../../../services/RestaurantOwnerService";
import AddRestaurantForm from "../../forms/admin/AdminAddRestaurantForm";
import { useNavigate } from "react-router-dom";
import AdminEditRestaurantForm from "../../forms/admin/AdminEditResturantForm";

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [restaurantId, setRestaurantId] = useState('');
    const [daysOfTheWeek, setDaysOfTheWeek] = useState([]);
    const [restaurantOwners, setRestaurantOwners] = useState([]);
    const [editnigRestaurantId, setEditingRestaurantId] = useState('');
    const [openAddRestaurantModal, setOpenAddRestaurantModal] = useState(false);
    const [openEditRestaurantModal, setOpenEditRestaurantModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurantFromDb();
        fetchDaysOfTheWeekFromDb();
        fetchRestaurantOwnersFromDb();
    }, []);

    useEffect(() => {

    }, [restaurants])

    const fetchRestaurantFromDb = async () => {
        try {
            const restaurantsFromDb = await fetchAllRestaurants();
            setRestaurants(restaurantsFromDb);
            console.log(`Restorani:`, restaurantsFromDb);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    }

    const fetchDaysOfTheWeekFromDb = async () => {
        try {
            const daysOfTheWeekFromDb = await fetchDaysOfTheWeek();
            setDaysOfTheWeek(daysOfTheWeekFromDb);
            console.log("Dani nedelje:", daysOfTheWeekFromDb)
        } catch (error) {
            console.error("Error fetching days of the week:", error);
        }
    }

    const fetchRestaurantOwnersFromDb = async () => {
        try {
            const restaurantOwnersFromDb = await fetchAllRestaurantOwners();
            setRestaurantOwners(restaurantOwnersFromDb);
            console.log(`Vlasnici restorana:`, restaurantOwnersFromDb);
        } catch (error) {
            console.error("Error fetching restaurant owners:", error);
        }
    }

    const handleAddRestaurant = () => {
        setOpenAddRestaurantModal(true);
    }

    const addNewRestaurant = (restaurant) => {
        setRestaurants((prev) => [...prev, restaurant])
    }
    const updateExistingRestaurant = (restaurant)=>{
        setRestaurants(
            restaurants.map((prev)=> prev.id === restaurant.id? restaurant : prev)
        )
    }

    const handleEditRestaurant = (id) => {
        setEditingRestaurantId(id);
        setOpenEditRestaurantModal(true);
    }

    const handleDeleteRestaurant = (id) => {
        setOpenConfirmationModal(true);
        setRestaurantId(id);
    }

    const deleteRestaurantAction = async () => {
        try {
            await deleteRestaurant(restaurantId);
            setRestaurantId(null);
            fetchRestaurantFromDb();
            setOpenConfirmationModal(false);
        } catch (error) {
            console.error("greska:", error)
        }
    }

    return (
        <div className="admin-restaurant-page-container">
            <h1>Restaurants</h1>
            <div
                className="admin-restaurant-add-button-wrapper"
            >
                <button
                className="admin-restaurant-add-button positive-action"
                onClick={handleAddRestaurant}
                >
                    Add Restaurant
                    </button>
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
                            <th>Status</th>
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
                                    <td 
                                    className={`admin-restaurant-page-restaurant-status-${restaurant.isCreated ? "published" : "pending"}`}
                                    >
                                        {restaurant.isCreated ? "Published" : "Pending"}
                                        </td>
                                    <td>
                                        <button
                                            className="admin-restaurant-edit-button positive-action"
                                            onClick={() => handleEditRestaurant(restaurant.id)}
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
                {openConfirmationModal &&
                    <ConfirmationPopup
                        message={"Are you sure you want delete restaurant?"}
                        onYes={deleteRestaurantAction}
                        onNo={() => setOpenConfirmationModal(false)}
                    />
                }

                {openAddRestaurantModal &&
                    <AddRestaurantForm
                        days={daysOfTheWeek}
                        restaurantOwners={restaurantOwners}
                        setOpenAddRestaurantModal={setOpenAddRestaurantModal}
                        addRestaurant={addNewRestaurant}
                    />
                }

                {openEditRestaurantModal &&
                    <AdminEditRestaurantForm
                        restaurantId={editnigRestaurantId}
                        setOpenEditRestaurantModal={setOpenEditRestaurantModal}
                        restaurantOwners={restaurantOwners}
                        setUpdatedRestaurant={updateExistingRestaurant}
                    />
                }

            </div>
        </div>
    );
}
export default AdminRestaurants;