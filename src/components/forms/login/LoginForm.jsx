import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginService } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../config/AuthContext";
import "../../../styles/global.scss";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import UserContext from "../../../config/UserContext";
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
  const handleCloseError = () => setShowError(false);

  function lowercaseFirstLetter(word) {
    return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  }

  const onSubmit = async (data, e) => {
    setErrorMessage('');
    try {
      const result = await loginService(data.username, data.password);
      const token = result;
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (user) {
      navigate(`/${lowercaseFirstLetter(user.role)}`);
    }
  }, [user])

  return (
    <div id="LoginFormContainer">
      <form id="LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <h2 id="LogInTitle">Log in</h2>

        <div id="FormLoginInputsContainer">
          <input
            id="username"
            placeholder="Your username"
            autoComplete="username"
            {...register("username", {
              required: "Username is required",
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
              autoComplete="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
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
            disabled={!isDirty || !isValid || isSubmitting || user}
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
