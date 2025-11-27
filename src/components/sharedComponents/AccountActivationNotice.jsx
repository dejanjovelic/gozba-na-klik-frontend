import React, { useState } from "react";
import { resendActivatonEmail } from "../../services/userServices";
import "../../styles/accountActivationNotice.scss";
import { useNavigate } from "react-router-dom";

const AccountActivationNotice = ({ mode, email, username, setErrorMessage, setShowError, setSuccessMessage, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleResend = async () => {
        setIsLoading(true);
        try {
            const response = await resendActivatonEmail(username);
            setSuccessMessage(response.message);
            
            if (mode === "login") {
                onClose?.();
            } else {
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        }
        catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else if (error.response?.data?.error === "Email is already confirmed.") {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching Addresses:", error);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="activation-notice">
            {mode === "register" && (
                <>
                    <h2>Thanks for signing up!</h2>
                    <br />
                    <p>We've sent an activation email to:</p>
                    <p>{email}</p>
                    <br />
                    <p>If you do not recieve any message on your email, press the button to resend the message again.</p>
                    <br />
                </>
            )}
            {mode === "login" && (
                <>
                    <h2>Verification required</h2>
                    <br />
                    <p>We've noticed that your email is not verified, please check your inbox for account activation.</p>
                    <br />
                    <p>If you didn't receive any message on your email, press the button to resend it.</p>
                    <br />
                </>
            )}
            <button onClick={handleResend} disabled={isLoading}>
                {isLoading ? <span className="spinner"></span> : "Resend Link"}
            </button>
        </div>
    )
}

export default AccountActivationNotice;