import React, { useContext, useEffect, useState } from "react";
import SucessPopup from "../../../../shared/components/Popups/SucessPopup.jsx";
import ErrorPopup from "../../../../shared/components/Popups/ErrorPopup.jsx";
import {
  deleteRestaurant,
  fetchAllRestaurants,
  fetchDaysOfTheWeek,
} from "../../../Restaurant/services/RestaurantService.js";
import "../../styles/adminRestaurantsPage.scss";
import ConfirmationPopup from "../../../../shared/components/Popups/ConfirmationPopup.jsx";
import { fetchAllRestaurantOwners } from "../../../RestaurantOwner/services/RestaurantOwnerService.js";
import AddRestaurantForm from "../components/AdminAddRestaurantForm.jsx";
import { useNavigate } from "react-router-dom";
import AdminEditRestaurantForm from "../components/AdminEditResturantForm.jsx";
import UserContext from "./../../../../shared/context/UserContext.jsx";
import HandleError from "../../../../shared/components/HandleError.jsx";
import Spinner from "../../../../shared/components/Spinner.jsx";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [daysOfTheWeek, setDaysOfTheWeek] = useState([]);
  const [restaurantOwners, setRestaurantOwners] = useState([]);
  const [editingRestaurantId, setEditingRestaurantId] = useState("");
  const [openAddRestaurantModal, setOpenAddRestaurantModal] = useState(false);
  const [openEditRestaurantModal, setOpenEditRestaurantModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role.toLowerCase().trim() !== "administrator") {
      navigate("/");
    }
  }, [navigate, user]);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchRestaurantsFromDb(),
        fetchDaysOfTheWeekFromDb(),
        fetchRestaurantOwnersFromDb(),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const fetchRestaurantsFromDb = async () => {
    try {
      const restaurantsFromDb = await fetchAllRestaurants();
      setRestaurants(restaurantsFromDb);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        entity: "Restaurants",
      });
    }
  };

  const fetchDaysOfTheWeekFromDb = async () => {
    try {
      const daysOfTheWeekFromDb = await fetchDaysOfTheWeek();
      setDaysOfTheWeek(daysOfTheWeekFromDb);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        entity: "Days of the week",
      });
    }
  };

  const fetchRestaurantOwnersFromDb = async () => {
    try {
      const restaurantOwnersFromDb = await fetchAllRestaurantOwners();
      setRestaurantOwners(restaurantOwnersFromDb);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        entity: "Restaurant owners",
      });
    }
  };

  const handleAddRestaurant = () => {
    setOpenAddRestaurantModal(true);
  };

  const addNewRestaurant = (restaurant) => {
    setRestaurants((prev) => [...prev, restaurant]);
  };
  const updateExistingRestaurant = (restaurant) => {
    setRestaurants(
      restaurants.map((prev) =>
        prev.id === restaurant.id ? restaurant : prev,
      ),
    );
  };

  const handleEditRestaurant = (id) => {
    setEditingRestaurantId(id);
    setOpenEditRestaurantModal(true);
  };

  const handleDeleteRestaurant = (id) => {
    setOpenConfirmationModal(true);
    setRestaurantId(id);
  };

  const deleteRestaurantInDb = async () => {
    try {
      await deleteRestaurant(restaurantId);
      setRestaurantId(null);
      fetchRestaurantsFromDb();
      setOpenConfirmationModal(false);
      setSuccessMsg(
        `Restaurant with Id: ${restaurantId} deleted successfully!`,
      );
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        notFoundMessage: `Restaurant with Id: ${restaurantId}`,
        entity: "Restaurant",
      });
      setOpenConfirmationModal(false);
    }
  };

  const handleErrorModalClose = () => {
    setErrorMsg("");
    setIsLoading(true);
    loadData();
  };

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && errorMsg && (
        <ErrorPopup message={errorMsg} onClose={handleErrorModalClose} />
      )}
      {!isLoading && !errorMsg && restaurants?.length > 0 && (
        <div className="admin-restaurant-page-container">
          <h1>Restaurants</h1>
          <div className="admin-restaurant-add-button-wrapper">
            <button
              className="admin-restaurant-add-button positive-action"
              onClick={handleAddRestaurant}
            >
              Add Restaurant
            </button>
          </div>
          <div className="admin-restaurants-page-table-wrapper">
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

            {openConfirmationModal && (
              <ConfirmationPopup
                message={"Are you sure you want delete restaurant?"}
                onYes={deleteRestaurantInDb}
                onNo={() => setOpenConfirmationModal(false)}
              />
            )}

            {openAddRestaurantModal && (
              <AddRestaurantForm
                days={daysOfTheWeek}
                restaurantOwners={restaurantOwners}
                setOpenAddRestaurantModal={setOpenAddRestaurantModal}
                addRestaurant={addNewRestaurant}
                setErrorMsg={setErrorMsg}
                setSuccessMsg={setSuccessMsg}
              />
            )}

            {openEditRestaurantModal && (
              <AdminEditRestaurantForm
                restaurantId={editingRestaurantId}
                setOpenEditRestaurantModal={setOpenEditRestaurantModal}
                restaurantOwners={restaurantOwners}
                setUpdatedRestaurant={updateExistingRestaurant}
                setErrorMsg={setErrorMsg}
                setSuccessMsg={setSuccessMsg}
              />
            )}
          </div>
        </div>
      )}
      {!isLoading && !errorMsg && restaurants.length === 0 && (
        <div className="no-restaurants-message-wrapper">
          <h1 className="no-restaurants-message">
            You don't have any restaurants yet
          </h1>
        </div>
      )}
      ;
      {successMsg && (
        <SucessPopup
          message={successMsg}
          onClose={() => setSuccessMsg("")}
          timeOut={2}
        />
      )}
      ;
    </>
  );
};
export default AdminRestaurants;
