import React from "react";
import { useForm } from "react-hook-form";
import "../../../styles/RestaurauntOwnerOrderTime.scss";

const RestaurauntOwnerOrderTimeForm = ({ order, onClose, onSubmitTime }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { time: order?.time || "" },
  });

  const onSubmit = (data) => {
    onSubmitTime(data.time);
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
          <h3>Postavi vreme spremnosti</h3>
          <label htmlFor="time">Vreme spremnosti porudžbine:</label>
          <input
            type="time"
            id="time"
            {...register("time", { required: "Molimo izaberite vreme." })}
            className={errors.time ? "inputError" : ""}
          />
          {errors.time && <p className="errorText">{errors.time.message}</p>}

          <div className="buttonGroup">
            <button type="submit" className="submitButton">
              Sačuvaj
            </button>
            <button type="button" className="closeButton" onClick={onClose}>
              Zatvori
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RestaurauntOwnerOrderTimeForm;
