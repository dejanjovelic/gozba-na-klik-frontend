import React, { useEffect, useState } from "react";
import {
  fetchRestaurantBasicData,
  updateRestaurant,
} from "../../../Restaurant/services/RestaurantService.js";
import RestaurantBasicFields from "../sharedComponents/RestaurantBasicFeilds";
import { useForm } from "react-hook-form";

const AdminEditRestaurantForm = ({
  restaurantId,
  restaurantOwners,
  setOpenEditRestaurantModal,
  setUpdatedRestaurant,
  setSuccessMsg,
  setErrorMsg,
}) => {
  const [restaurant, setRestaurant] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      address: "",
      capacity: "",
      city: "",
      description: "",
      id: "",
      isCreated: true,
      name: "",
      restaurantImageUrl: "",
      restaurantOwnerId: "",
    },
  });

  useEffect(() => {
    getRestaurantBasicDataFromDb();
  }, [restaurantId]);

  useEffect(() => {
    if (restaurant) {
      reset({
        address: restaurant?.address ? restaurant.address : "",
        capacity: restaurant?.capacity ? restaurant.capacity : "",
        city: restaurant?.city ? restaurant.city : "",
        description: restaurant?.description ? restaurant.description : "",
        id: restaurant?.id || "",
        isCreated: restaurant?.isCreated || true,
        name: restaurant?.name || "",
        restaurantImageUrl: restaurant?.restaurantImageUrl
          ? restaurant.restaurantImageUrl
          : "",
        restaurantOwnerId: restaurant?.restaurantOwnerId || "",
      });
    }
  }, [reset, restaurant]);

  const getRestaurantBasicDataFromDb = async () => {
    try {
      const restaurantBasicDatafromDb =
        await fetchRestaurantBasicData(restaurantId);
      setRestaurant(restaurantBasicDatafromDb);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        badRequestmessage: "Invalid restaurant data",
        notFoundMessage: `Restaurant with Id: ${restaurantId}`,
        entity: "Restaurant",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const updatedRestaurantFromDb = await updateRestaurant(
        restaurantId,
        data,
      );
      console.log(`Azuriran restoran: `, updatedRestaurantFromDb);
      setUpdatedRestaurant(updatedRestaurantFromDb);
      setOpenEditRestaurantModal(false);
      setSuccessMsg("Restaurant updated successfully!");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        badRequestmessage: "Invalid restaurant data",
        notFoundMessage: `Restaurant with Id: ${restaurantId}`,
        entity: "Restaurant",
      });
    }
  };

  const handleClose = () => {
    setOpenEditRestaurantModal(false);
    setRestaurant(null);
  };
  return (
    <div className="edit-restaurant-page-container">
      {restaurant ? (
        <div className="edit-restaurant-page-wrapper" onClick={handleClose}>
          <form
            className="edit-restaurant-page-form"
            onSubmit={handleSubmit(onSubmit)}
            onClick={(e) => e.stopPropagation()}
          >
            <RestaurantBasicFields
              register={register}
              errors={errors}
              restaurantOwners={restaurantOwners}
            />
            <label htmlFor="address" className="edit-restaurant-page-label">
              Address
            </label>
            <input
              id="address"
              type="text"
              {...register("address", { required: "Address is required." })}
            />
            <div className="error-message">
              {errors ? errors.address?.message : ""}
            </div>

            <label htmlFor="capacity" className="edit-restaurant-page-label">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              {...register("capacity", { required: "Capacity is required." })}
            />
            <div className="error-message">
              {errors ? errors.capacity?.message : ""}
            </div>

            <label htmlFor="city" className="edit-restaurant-page-label">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register("city", { required: "City is required." })}
            />
            <div className="error-message">
              {errors ? errors.city?.message : ""}
            </div>

            <label htmlFor="decription" className="edit-restaurant-page-label">
              Description
            </label>
            <textarea
              id="description"
              type="text"
              rows={4}
              cols={40}
              {...register("description", {
                required: "Description is required.",
              })}
            />
            <div className="error-message">
              {errors ? errors.description?.message : ""}
            </div>

            <div className="edit-restaurant-page-button-wrapper">
              <button
                type="submit"
                className="edit-restaurant-save-button positive-action"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default AdminEditRestaurantForm;