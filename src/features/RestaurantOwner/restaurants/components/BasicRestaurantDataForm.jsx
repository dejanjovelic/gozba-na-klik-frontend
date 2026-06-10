import React from "react";

const BasicRestaurntDataForm = ({ 
    handleBasicDataChange, 
    basicResturantFormData, 
    handleBasicDataSubmit,
    isDisabled
}) => {

    return (

        <fieldset className="restaurant-owner-edit-page-basic-data-container">
            <legend className="restaurant-owner-edit-page-basic-data-container-title">
                Basic Data
            </legend>

            <form
                className="restaurant-owner-edit-page-restaurant-basic-data-form"
            >
                <label htmlFor="address">Address: </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={basicResturantFormData?.address || ""}
                    onChange={(e) => handleBasicDataChange({ address: e.target.value })} />

                <label htmlFor="capacity">Capacity: </label>
                <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    value={basicResturantFormData.capacity || ""}
                    onChange={(e) => handleBasicDataChange({ capacity: e.target.value })} />

                <label htmlFor="city">City: </label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    value={basicResturantFormData.city || ""}
                    onChange={(e) => handleBasicDataChange({ city: e.target.value })} />

                <label htmlFor="description">Description: </label>
                <textarea
                    name="description"
                    id="description"
                    className="restaurant-owner-page-basic-data-description-input"
                    value={basicResturantFormData.description || ""}
                    onChange={(e) => handleBasicDataChange({ description: e.target.value })}
                     rows={6}
                    />

                <div className="restaurant-owner-edit-page-basic-data-save-button-wrapper">
                    <button
                        type="button"
                        className="restaurant-owner-edit-page-basic-data-save-button positive-action"
                        onClick={handleBasicDataSubmit}
                        disabled={isDisabled}
                    >
                        Save
                    </button>
                </div>
            </form>
        </fieldset>
    );
};
export default BasicRestaurntDataForm;