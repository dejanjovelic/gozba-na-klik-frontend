import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginService } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import "../../../styles/global.scss";
import "../../../styles/loginForm.scss";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import UserContext from "../../../config/UserContext";
import AccountActivationNotice from "../../sharedComponents/AccountActivationNotice";
import SucessPopup from "../../pages/Popups/SucessPopup";
import { Lock } from "lucide-react";
import { User } from "lucide-react";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showActivationNotice, setShowActivationNotice] = useState(false);
  const [activationUsername, setActivationUsername] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState("");

  function lowercaseFirstLetter(word) {
    return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  }

  const onSubmit = async (data, e) => {
    setErrorMessage("");
    try {
      setActivationUsername(data.username);
      const result = await loginService(data.username, data.password);
      const token = result;
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (error) {
      console.log(error.message);

      // Primer: backend vraća error.message = "Account not activated"
      if (
        error.response?.data?.error ===
        "Email is not confirmed. Check your inbox"
      ) {
        setShowActivationNotice(true);
      } else {
        setErrorMessage(error.message);
        setShowError(true);
      }
    }
  };

  function handleFortgotBtnclick(e) {
    e.preventDefault();
    navigate("/forgotPassword");
  }

  useEffect(() => {
    if (user?.role) {
      navigate(`/${lowercaseFirstLetter(user.role)}`);
    }
  }, [user]);

  return (
    <div className="Container">
      <div className="LoginContainer">
        <div className="imgContainer">
          <img
            src="https://res.cloudinary.com/dsgans7nh/image/upload/v1764622415/LoginForma-removebg-preview_k7pt5t.png"
            alt="Login illustration"
          />
        </div>

        {showActivationNotice ? (
          <AccountActivationNotice
            mode="login"
            username={activationUsername}
            setErrorMessage={setErrorMessage}
            setShowError={setShowError}
            setSuccessMessage={setSuccessMessage}
            onClose={() => setShowActivationNotice(false)}
          />
        ) : (
          <div id="LoginFormContainer">
            <form id="LoginForm" onSubmit={handleSubmit(onSubmit)}>
              <h2 id="LogInTitle">Log in</h2>

              <div id="FormLoginInputsContainer">
                <User size={30} id="User" />
                <input
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                {errors.username && (
                  <p className="errorMessage">{errors.username.message}</p>
                )}

                <div id="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <Lock size={30} id="Lock" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="errorMessage">{errors.password.message}</p>
                )}
              </div>

              <button
                className="LoginSubmitButton"
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting || user}
              >
                {isSubmitting ? <span className="spinner"></span> : "Log in"}
              </button>
              <div className="forgotBtn-container">
                <button id="forgotBtn" onClick={handleFortgotBtnclick}>
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        )}

        {showError && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setShowError(false)}
          />
        )}

        {successMessage && (
          <SucessPopup
            message={successMessage}
            timeOut={2}
            onClose={() => setSuccessMessage("")}
          />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
