import React from "react";
import "../../../styles/popups.scss";
import { CircleQuestionMark } from "lucide-react";
const ConfirmationPopup = ({ message, onYes, onNo }) => {
  return (
    <>
      <div id="Overlay"></div>
      <div id="ConfirmationPopupContainer">
        <div id="messageContainer">
          <CircleQuestionMark color="#EA9332" id="icon" />
          <p>{message}</p>
        </div>
        <div id="buttonWrapper">
          <button id="ConfirmationNoButton" onClick={onNo}>
            No
          </button>
          <button id="ConfirmationYesButton" onClick={onYes}>
            Yes
          </button>
        </div>
      </div>
    </>
  );
};
export default ConfirmationPopup;
