import { CircleAlert } from "lucide-react";
import React, { useState } from "react";

const RestaurantNonWorkingDateForm = ({
  setNewNonWorkingDate,
  handleAddNewNonWorkingDate,
  newNonWorkingDate,
  handleDeleteNonWorkingDate,
  isOpen,
  setIsOpen,
  handleSaveNonWorkingDatesChanges,
  nonWorkingDates,
  inputErrorMessage,
  setInputErrorMessage,
  isDisabled,
}) => {
  const handleClose = () => {
    setIsOpen(false);
    setInputErrorMessage("");
  };

  return (
    <section className="restaurant-owner-edit-restaurant-non-working-dates-container">
      <h3 className="restaurant-owner-edit-restaurant-non-working-dates-title">
        Non-Working Dates
      </h3>

      <div className="restaurant-owner-edit-restaurant-non-working-date-wrapper">
        <div className="restaurant-owner-edit-restaurant-non-working-dates-input-form-section">
          <h3>Add new non-working date</h3>
          {isOpen && (
            <form className="restaurant-owner-edit-restaurant-non-working-dates-form">
              <label htmlFor="date">New non-working date: </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newNonWorkingDate}
                onChange={(e) => setNewNonWorkingDate(e.target.value)}
                onClick={() => setInputErrorMessage("")}
              />
              <div className="form-error-message">
                {inputErrorMessage && <CircleAlert size={16} />}
                <span>{inputErrorMessage ?? " "}</span>
              </div>

              <div className="restaurant-owner-restaurant-page-add-restaurant-button-wrapper">
                <button
                  type="button"
                  className="restaurant-owner-restaurant-add-button positive-action"
                  onClick={handleAddNewNonWorkingDate}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="restaurant-owner-restaurant-cancel-adding-button negative-action"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div onClick={() => setIsOpen(true)}>
            {!isOpen && <button className="add-new-non-working-date">+</button>}
          </div>
        </div>

        <div className="restaurant-owner-edit-restaurant-non-working-dates-section">
          <div className="restaurant-owner-edit-page-non-working-date-selected-dates-container">
            <h3 className="restaurant-owner-edit-page-non-working-date-selected-dates">
              Non-working dates:
            </h3>
          </div>
          {nonWorkingDates &&
            nonWorkingDates.map((nwd, i) => (
              <div
                className="restaurant-owner-edit-page-restaurant-non-working-date-wrapper"
                key={nwd.date}
              >
                <div className="non-working-date-number-element">{i + 1}. </div>
                <div className="non-working-date-date-element">{nwd.date}</div>
                <div className="non-working-date-delete-button-wrapper">
                  <button
                    className="non-working-date-delete-button negative-action"
                    onClick={() => handleDeleteNonWorkingDate(nwd.date)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="non-working-date-save-button-wrapper">
        <button
          className="non-working-date-save-button positive-action"
          onClick={handleSaveNonWorkingDatesChanges}
          disabled={isDisabled}
        >
          Save
        </button>
      </div>
    </section>
  );
};
export default RestaurantNonWorkingDateForm;