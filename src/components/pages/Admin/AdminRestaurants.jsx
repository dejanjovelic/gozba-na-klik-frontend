import React, { useEffect, useState } from "react";
import { deleteRestaurant, fetchAllRestaurants, fetchDaysOfTheWeek } from "../../../services/RestaurantService";
import "../../../styles/adminRestaurantsPage.scss";
import ConfirmationPopup from "../Popups/ConfirmationPopup";
import { fetchAllRestaurantOwners } from "../../../services/RestaurantOwnerService";
import AddRestaurantForm from "../../forms/admin/AdminAddRestaurantForm";
import { useNavigate } from "react-router-dom";

const AdminRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [restaurantId, setRestaurantId] = useState('');
    const [daysOfTheWeek, setDaysOfTheWeek] = useState([]);
    const [restaurantOwners, setRestaurantOwners] = useState([]);
    const [editnigRestaurantId, setEditingRestaurantId] = useState('');
    const [openRestaurantModal, setOpenRestaurantModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurantFromDb();
        fetchDaysOfTheWeekFromDb();
        fetchRestaurantOwnersFromDb();
    }, []);

    useEffect(()=>{

    },[restaurants])

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
        setOpenRestaurantModal(true);
    }

    const addNewRestaurant = (restaurant)=>{
        setRestaurants((prev)=>[...prev, restaurant])
    }

    const handleEditRestaurant = (id) => {

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
                className="admin-restaurant-add-button positive-action"
                onClick={handleAddRestaurant}
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
                                    <td>{restaurant.isCreated? "Published":"Pending"}</td>
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
                {openRestaurantModal &&
                    <AddRestaurantForm
                        days={daysOfTheWeek}
                        restaurantOwners={restaurantOwners}
                        onClose={setOpenRestaurantModal}
                        addRestaurant={addNewRestaurant}
                    />

                }
            </div>
        </div>
    );
}
export default AdminRestaurants;