import React from "react";
import { useForm } from "react-hook-form";
import { createRestaurant } from "../../../Restaurant/services/RestaurantService.js";
import RestaurantBasicFields from "../sharedComponents/RestaurantBasicFeilds";
import HandleError from "../../../../shared/components/HandleError.jsx";

const AddRestaurantForm = ({
  restaurantOwners,
  setOpenAddRestaurantModal,
  addRestaurant,
  setSuccessMsg,
  setErrorMsg,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const restaurant = { ...data, id: 0 };
    try {
      const newRestaurantInDb = await createRestaurant(restaurant);
      console.log(`Novokreirani restoran`, restaurant);
      setOpenAddRestaurantModal(false);
      addRestaurant(newRestaurantInDb);
      setSuccessMsg("Restaurant created successfully!");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMsg,
        badRequestmessage: "Invalid restaurant data",
        notFoundMessage: `Restaurant with Id: ${restaurant.id}`,
        entity: "Restaurant"
      });
    }
  };

  return (
    <div className="add-restaurant-page-container">
      <div
        className="add-restaurant-page-wrapper"
        onClick={() => setOpenAddRestaurantModal(false)}
      >
        <form
          className="add-restaurant-page-form"
          onSubmit={handleSubmit(onSubmit)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="add-restaurant-page-header-wrapper">
            <h2 className="add-restaurant-page-header">New Restaurant</h2>
          </div>

          <RestaurantBasicFields
            register={register}
            errors={errors}
            restaurantOwners={restaurantOwners}
          />
          <div className="add-restaurant-page-add-button-wrapper">
            <button
              type="submit"
              className="add-restaurant-page-add-button positive-action"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddRestaurantForm;
