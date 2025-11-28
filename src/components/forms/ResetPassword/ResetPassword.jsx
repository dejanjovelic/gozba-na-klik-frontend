import React, { useState } from "react";
import { resetPassword } from "../../../services/userServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../../styles/resetPassword.scss"
import ErrorPopup from "../../pages/Popups/ErrorPopup";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  let data;

  const submit = async () => {
    try {
      data = {
        newPassword: pass,
        token: token,
        email: email
      }
      const page = await resetPassword(data);
      setSuccessMessage("You successfully updated password.")
      setTimeout(() => {
        navigate(`${page}`);
      }, 1000);
    } catch (error) {
      if (error.status) {
                if (error.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.");
                } else if (error.status === 404) {
                    setErrorMessage(`User with email: ${data.email} not found.`);
                }else if (error.status === 400) {
                    setErrorMessage("The reset link is invalid or has expired. Please request a new one.");
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log(`An error occured while resetting password:`, error);
        }
  }

  const handleClose = () => {
        navigate("/login");
        setErrorMessage("")
    }

    if (errorMessage) {
        return (
            <ErrorPopup message={errorMessage} onClose={handleClose} />
        )
    }

  return (
    successMessage ? (
      <div className="successMessage-container">
        <div className="successMessage-wrapper">
          {successMessage}
        </div>
      </div>
    ) : (
      <div className="newPassword-mainContainer">

        <div className="newPassword-contetntContainer">
          <div className="newPassword-infoContainer">
            <h2>New password setting</h2>
            <p>Please enter your new password to complete the reset.</p>
          </div>

          <div className="newPassword-FormContainer">
            <label htmlFor="password">Set new password </label>
            <input
              id="password"
              type="password"
              placeholder="New password"
              onChange={e => setPass(e.target.value)}
            />
            <div className="newPasswordBtn-container">
              <button className="newPasswordSubmitBtn" onClick={submit}>Reset</button>
            </div>
          </div>
        </div>
      </div>)
  );
}
export default ResetPassword;