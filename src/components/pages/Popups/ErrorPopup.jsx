import React from "react";
import "../../../styles/popups.scss";
import { CircleAlert } from "lucide-react";
const ErrorPopup = ({ message, onClose }) => {
  return (
    <>
      <div id="Overlay"></div>
      <div id="ErrorPopupContainer">
        <div id="messageContainer">
          <CircleAlert color="red" id="icon" />
          <p>Error: {message}</p>
        </div>
        <button id="PopupCloseButton" onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};
export default ErrorPopup;
