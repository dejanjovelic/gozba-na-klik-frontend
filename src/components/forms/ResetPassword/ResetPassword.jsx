import React, { useState } from "react";
import { resetPassword } from "../../../services/userServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../../styles/resetPassword.scss"
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const email = params.get("email");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  let data;

  const submit = async () => {
    try {
      validatePassword();
      data = {
        newPassword: password,
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
        } else if (error.status === 400) {
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

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
    } else if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
    } else if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter.');
    } else if (!/\d/.test(password)) {
      setError('Password must contain at least one number.');
    } else if (!/[!@#$%^&*()]/.test(password)) {
      setError('Password must contain at least one special character.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
    }
  };

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
            <div className="newPassword-section">
              <div className="newPassword-wrapper">

                <label htmlFor="password">Set new password </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="New password"
                  onChange={e => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </span>
              </div>

              <div className="newConfirmPassword-wrapper">
                <label htmlFor="confirmPassword">Confirm new password </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm new password"
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </span>
              </div>
            </div>
            <div className="newPasswordBtn-container">
              <button className="newPasswordSubmitBtn" onClick={submit}>Reset</button>
            </div>
            {error && <div className="errorMessage">{error}</div>}
          </div>
        </div>
      </div>)
  );
}
export default ResetPassword;