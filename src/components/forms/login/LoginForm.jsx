import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginService } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../config/AuthContext";
import "../../../styles/global.scss";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseError = () => setShowError(false);

  const onSubmit = async (data) => {
    try {
      const result = await loginService(data.username, data.password);
      login(result);
      navigate("/home");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  return (
    <div id="LoginFormContainer">
      <form id="LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h2 id="LogInTitle">Log in</h2>

        <div id="FormLoginInputsContainer">
          <input
            id="username"
            placeholder="Your username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          {errors.username && (
            <p className="errorMessage">{errors.username.message}</p>
          )}
          <br />

          <div id="password-container">
            <input
              id="password"
              placeholder="Your password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              id="icon-button"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="errorMessage">{errors.password.message}</p>
          )}
        </div>
        <br />
        <div
          id="signUpBtn-container"
          data-tooltip-id="username-tooltip"
          data-tooltip-content="All field are required."
        >
          <button
            className="LoginSubmitButton"
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting || isLoggedIn}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
              </>
            ) : (
              "Log in"
            )}
          </button>
          {!isValid && <Tooltip id="username-tooltip" place="right" />}
        </div>
      </form>
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </div>
  );
};

export default LoginForm;
