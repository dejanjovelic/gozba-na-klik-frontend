import React from "react";
import SwitchButton from "../../../../shared/components/SwitchButton";
import { CircleAlert } from "lucide-react";

const RestaurantWorkingHoursForm = ({
    workingHours,
    handleWorkingHoursChange,
    handleSaveWorkingHoursChanges,
    inputErrorMessage,
    setInputErrorMessage,
    isDisabled,
    workingHourWithMissingData }) => {
        console.log("Podaci iz roditelja: ", workingHourWithMissingData)

        // const handleClick = ()=>{

        // }


    return (
        <fieldset className="restaurant-owner-edit-page-working-hours-container">
            <legend className="restaurant-owner-edit-page-working-hours-container-title">
                Working Hours
            </legend>

            <form className="restaurant-owner-edit-page-working-hours-form">
                {workingHours &&
                    workingHours.map((wh) => (
                        <div
                            className="input-wrapper"
                            key={wh.dayOfTheWeek}
                        >
                            <p>{wh.dayOfTheWeek}</p>
                            <div className="restaurant-owner-edit-page-working-hours-day-of-the-week-row">
                                <SwitchButton
                                    label={"Is open"}
                                    checked={wh.isRestaurantOpen}
                                    onChange={(e) => handleWorkingHoursChange({
                                        dayOfTheWeek: wh.dayOfTheWeek,
                                        isRestaurantOpen: e.target.checked ? true : false,
                                        startingTime: null,
                                        endingTime: null
                                    })}
                                    onClick={()=>setInputErrorMessage("")}
                                />


                                <div className={`restaurant-owner-edit-page-working-hours-day-of-the-week-row-input-section ${wh.isRestaurantOpen ? "" : "hidden"}`}>
                                    <label htmlFor="startingTime">Starting time: </label>
                                    <input type="time"
                                        name="startingTime"
                                        id="startingTime"
                                        value={wh.startingTime || ""}
                                        onChange={(e) => handleWorkingHoursChange({
                                            dayOfTheWeek: wh.dayOfTheWeek,
                                            startingTime: e.target.value === "" ? null : e.target.value
                                        })} 
                                         onClick={()=>setInputErrorMessage("")}
                                        
                                        />

                                    <label htmlFor="endingTime">Ending time: </label>
                                    <input
                                        type="time"
                                        name="endingTime"
                                        className={
                                            wh.endingTime===null && wh.startingTime !== null ? "error-border" : ""
                                        }
                                        id="endingTime"
                                        value={wh.endingTime || ""}
                                        onChange={(e) => handleWorkingHoursChange({
                                            dayOfTheWeek: wh.dayOfTheWeek,
                                            endingTime: e.target.value === "" ? null : e.target.value
                                        })} 
                                        onClick={()=>setInputErrorMessage("")}

                                        />
                                </div>
                            </div>

                            {workingHourWithMissingData?.some(whMissingData => whMissingData.dayOfTheWeek === wh.dayOfTheWeek) &&
                                (<div className="form-error-message">
                                    {inputErrorMessage &&
                                        <CircleAlert size={16} />
                                    }
                                    <span>{inputErrorMessage ? inputErrorMessage : " "}</span>

                                </div>)}
                        </div>

                    ))}
                <div className="restaurant-owner-edit-page-working-hours-save-button-wrapper">
                    <button
                        type="button"
                        className="restaurant-owner-edit-page-working-hours-save-button positive-action"
                        disabled={isDisabled}
                        onClick={handleSaveWorkingHoursChanges}
                    >
                        Save
                    </button>
                </div>
            </form>

        </fieldset>
    )
}
export default RestaurantWorkingHoursForm;