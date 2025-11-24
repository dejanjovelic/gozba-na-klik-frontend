import React from "react";
import "../../styles/global.scss"

const Spinner = ({text="Loading..."}) => {

    return (
            <div className="spinner-wrapper">
                <div className="spinner"></div>
                <div className="spinner-text">{text}</div>
            </div>
    );
}

export default Spinner;