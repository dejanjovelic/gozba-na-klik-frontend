import React from "react";
import "../../../styles/popups.scss";
import { CircleCheck } from "lucide-react";
const SucessPopup = ({ message, timeOut, onClose }) => {
  return (
    <>
      <div id="SucessPopupContainer">
        <div id="messageContainer">
          <CircleCheck size={35} color="#2AB42E" id="icon" />
          <p>Sucess: {message}</p>
        </div>
        <button id="SucessCloseButton" onClick={onClose}>
          X
        </button>
      </div>
    </>
  );
};
export default SucessPopup;
