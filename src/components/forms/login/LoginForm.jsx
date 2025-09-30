import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginService } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../config/AuthContext";
import "../../../styles/global.scss";
import { Eye, EyeOff } from "lucide-react";
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  function lowercaseFirstLetter(word){
    return `${word.charAt(0).toLowerCase()}${word.slice(1)}`;
  }

  const onSubmit = async (data) => {
    try {
      const result = await loginService(data.username, data.password);
      console.log(`/${lowercaseFirstLetter(result.role)}`)
      console.log("Login successful:", result);
      login(result);
      alert(`Welcome, ${result.username}!`);
      navigate(`/${lowercaseFirstLetter(result.role)}`);
      
    } catch (error) {
      alert(error.message || "Login failed");
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
                  value: 5,
                  message: "Password must be at least 58 characters",
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
        <button
          className="LoginSubmitButton"
          type="submit"
          disabled={!isDirty || !isValid || isSubmitting || isLoggedIn}
        >
          {isSubmitting ? (
            <>
              Logging in...
              <span className="spinner"></span>
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
