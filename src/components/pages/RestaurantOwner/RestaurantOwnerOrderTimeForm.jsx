import React from "react";
import { useForm } from "react-hook-form";
import "../../../styles/RestaurauntOwnerOrderTime.scss";

const RestaurauntOwnerOrderTimeForm = ({ onClose, onSubmitMinutes }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { pickupReadyIn: 5 },
  });

  const onSubmit = (data) => {
    onSubmitMinutes(data.pickupReadyIn);
    reset();
  };

  return (
    <>
      <div id="Overlay" onClick={onClose}></div>

      <div className="formContainer">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="RestaurauntOwnerOrderTimeForm"
        >
          <label htmlFor="pickupReadyIn">Preparation time (in minutes): </label>
          <br />
          <br />
          <input
            type="number"
            id="pickupReadyIn"
            {...register("pickupReadyIn", {
              required: "Please enter the preparation time.",
              min: { value: 1, message: "Time must be between 1 and 60 minutes." },
              max: { value: 60, message: "Time must be between 1 and 60 minutes." }
            })}
            className={errors.pickupReadyIn ? "inputError" : ""}
          />
          {errors.pickupReadyIn && <p className="errorText">{errors.pickupReadyIn.message}</p>}

          <div className="buttonGroup">
            <button type="submit" className="submitButton">
              Save
            </button>
            <button type="button" className="closeButton" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RestaurauntOwnerOrderTimeForm;