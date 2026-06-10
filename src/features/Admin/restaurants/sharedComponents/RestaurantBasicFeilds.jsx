import React, { use, useEffect } from "react";

const RestaurantBasicFields = ({register, errors, restaurantOwners}) => {

    return (
        <>
            <label
                className="add-edit-restaurant-page-label"
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
                className="add-edit-restaurant-page-label"
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
        </>
    )
}
export default RestaurantBasicFields;