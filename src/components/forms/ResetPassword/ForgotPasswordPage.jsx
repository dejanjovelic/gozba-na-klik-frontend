import React, { useState } from "react";
import { forgotPassword as forgotPassword } from "../../../services/userServices";
import { useForm } from "react-hook-form";
import "../../../styles/forgotPassword.scss";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const resetPassword = async (formData) => {
        try {
            const resetUrlBase = "http://localhost:5173/reset-password";
            const data = { email: formData.email, resetUrlBase };
            const message = await forgotPassword(data);
            setSuccessMessage(message);
        } catch (error) {
            if (error.response.status) {
                if (error.response.status === 500) {
                    setErrorMessage("Server is temporarily unavailable. Please refresh or try again later.");
                } else if (error.response.status === 404) {
                    setErrorMessage(`User with email: ${formData.email} not found.`);
                }
            } else if (error.request) {
                setErrorMessage("The server is not responding. Please try again later.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log(`An error occured while creating Customer:`, error);
        }
    }

    const onSubmit = (formData) => {
        resetPassword(formData)

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
            <div className="forgotPassword-mainContainer">
                <div className="forgotPassword-contentContainer">
                    <div className="forgotPasswordInfoSection">
                        <h2>Reset Password</h2>
                        <p>Please enter your email address to reset your password</p>
                    </div>

                    <form className="forgotPassword-form" onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="email">Email </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="someone@example.com"
                            {...register("email", {
                                required: "Email field is required.",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Enter a valid email address.",
                                },
                            })}
                        />
                        <div className="input-error-message">{errors.email?.message}</div>
                        <button className="forgotPasswordSubmitBtn" type="submit">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        )
    );
}
export default ForgotPasswordPage;