import React from "react";
import { useForm } from "react-hook-form";
import { createRestaurant } from "../../../services/RestaurantService";
import { stopEvent } from "pdfjs-dist";

const AddRestaurantForm = ({ restaurantOwners, onClose, addRestaurant }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        const restaurant = { ...data, id: 0 }
        try {
            const newRestaurantInDb = await createRestaurant(restaurant);
            console.log(`Novokreirani restoran`, restaurant);
            onClose(false);
            addRestaurant(newRestaurantInDb);
        } catch (error) {
            console.log(`Error:`, error);
        }
    }

    return (
        <div className="add-restaurant-page-container">
            <div
                className="add-restaurant-page-wrapper"
            onClick={() => onClose(false)}
            >

                <form
                    className="add-restaurant-page-from"
                    onSubmit={handleSubmit(onSubmit)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="add-restaurant-page-header-wrapper">
                        <h2
                            className="add-restaurant-page-header"
                        >
                            New Restaurant
                        </h2>
                    </div>

                    <label
                        className="add-restaurant-page-label"
                        htmlFor="name"
                    >
                        Restaurant name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="restaurant name"
                        {...register("name", { required: "Name is reqired" })}
                    />
                    <div className="error-message">{errors ? (errors?.name?.message) : " "}</div>

                    <label
                        className="add-restaurant-page-label"
                        htmlFor="restaurantOwnerId"
                    >
                        Choose restaurant owner:
                    </label>
                    <select
                        name="restaurantOwnerId"
                        id="restaurantOwnerId"
                        {...register("restaurantOwnerId", { required: "restaurant owner is required." })}
                    >
                        {restaurantOwners.map(owner => (
                            <option
                                key={owner.id}
                                value={owner.id}
                                className="restaurantOwnerOption"
                            >
                                {owner.name} {owner.surname}
                            </option>
                        ))}
                    </select>
                    <div className="error-message">{errors?.restaurantOwnerId?.message}</div>
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
}
export default AddRestaurantForm;