import React from "react";
import "../../../styles/popups.scss";
import { CircleCheck } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
const SucessPopup = ({ message, timeOut, onClose }) => {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    // Start fade-out before actually removing the popup
    const timer = setTimeout(() => setFadeOut(true), timeOut * 1000 - 300); // start fade-out 0.3s before
    const closeTimer = setTimeout(() => onClose(), timeOut * 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [timeOut, onClose]);
  return (
    <>
      <div
        id="SucessPopupContainer"
        className={fadeOut ? "fade-out" : "fade-in"}
      >
        <div id="messageContainer">
          <CircleCheck size={35} color="#2AB42E" id="icon" />
          <p>Success: {message}</p>
        </div>
        <button id="SucessCloseButton" onClick={onClose}>
          X
        </button>
      </div>
    </>
  );
};
export default SucessPopup;
