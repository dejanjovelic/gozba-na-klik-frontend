import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createCustomer } from "../../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import "react-tooltip/dist/react-tooltip.css";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "../../sharedComponents/Spinner";
import { useAuth } from "../../../config/AuthContext";

const CustomerRegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const password = watch("password");

  const handleCloseError = () => setShowError(false);

  function showErrorMsg(message) {
    setErrorMsg(message);
    setShowError(true);
  }

  function showSuccessMsg(message) {
    setSuccessMsg(message);
    setTimeout(() => {
      setSuccessMsg("");
    }, 2000);
  }

  async function onSubmit(data) {
    const { username, name, surname, email, contactNumber, password } = data;
    try {
      setIsloading(true);
      const user = await createCustomer(data);
      setIsloading(false);
      if (user) {
        login(user);
      }
      showSuccessMsg("You have successfuly sign up.");
      navigate(`/customer`);
      reset();
    } catch (error) {
      if (error.status) {
        if (error.status === 500) {
          showErrorMsg(
            "Server is temporarily unavailable. Please refresh or try again later."
          );
        } else {
          showErrorMsg(`Error: ${error.status}`);
        }
      } else if (error.request) {
        showErrorMsg("The server is not responding. Please try again later.");
      } else {
        showErrorMsg("Something went wrong. Please try again.");
      }
      console.log(`An error occured while creating Customer:`, error);
    }
  }

  if (isLoading) {
    return <Spinner text="Sending..." />;
  }

  if (successMsg) {
    return <div className="successMsg">{successMsg}</div>;
  }

  if (errorMsg) {
    return <div className="errorMsg">{errorMsg}</div>;
  }

  return (
    <div className="registerForm-container">
      <div className="form-div">
        <h2>Sign Up</h2>

        {successMsg && <div className="successMsg">{successMsg}</div>}

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Your username"
            id="username"
            autoComplete="username"
            {...register("username", {
              required: "Username field is required.",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters long.",
              },
            })}
          />
          <div className="input-error-message">{errors.username?.message}</div>

          <div className="name-surname-container">
            <div className="name-container">
              <input
                type="text"
                id="name"
                placeholder="Your name"
                {...register("name", {
                  required: "Name field is required.",
                  minLength: {
                    value: 2,
                    message: "Name must have at least 2 letters.",
                  },
                })}
              />
              <div className="input-error-message">{errors.name?.message}</div>
            </div>

            <div className="surname-container">
              <input
                type="text"
                id="surname"
                placeholder="Your surname"
                {...register("surname", {
                  required: "Surname field is required.",
                  minLength: {
                    value: 2,
                    message: "Surname must have at least 2 letters.",
                  },
                })}
              />
              <div className="input-error-message">
                {errors.surname?.message}
              </div>
            </div>
          </div>

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

          <input
            type="tel"
            id="contactNumber"
            placeholder="+381601234567"
            autoComplete="tel"
            {...register("contactNumber", {
              required: "Contact number field is required.",
              pattern: {
                value: /^\+381\d{9}$/,
                message:
                  "Phone number must start with +381 and contain 9 digits.",
              },
            })}
          />
          <div className="input-error-message">
            {errors.contactNumber?.message}
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Your password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password field is required.",
                minLength: {
                  value: 5,
                  message: "Password must have at least 5 characters.",
                },
              })}
            />
            <div className="input-error-message">
              {errors.password?.message}
            </div>
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm Password field is required.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />
            <div className="input-error-message">
              {errors.confirmPassword?.message}
            </div>
            <span
              className="toggle-password"
              onClick={() => {
                setShowConfirmPassword((prev) => !prev);
              }}
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </span>
          </div>

          <div
            id="signUpBtn-container"
            data-tooltip-id="username-tooltip"
            data-tooltip-content="All fields are required."
          >
            <button disabled={!isValid} id="signUpBtn" type="submit">
              Sign Up
            </button>
            {!isValid && <Tooltip id="username-tooltip" place="right" />}
          </div>
        </form>

        {showError && (
          <ErrorPopup message={errorMsg} onClose={handleCloseError} />
        )}
      </div>
    </div>
  );
};

export default CustomerRegisterForm;
