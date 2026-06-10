import React from "react";
import "../../styles/switchButton.style.scss";

const SwitchButton = ({ label, checked, onChange, onClick}) => {
  return (
    <label className="switch-wrapper">
      <span className="switch-label">{label}</span>

      <div className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onClick={onClick}
        />
        <span className="slider"></span>
      </div>
    </label>
  );
};
export default SwitchButton;