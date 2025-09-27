import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginService } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../config/AuthContext"; 

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const onSubmit = async (data) => {
    try {
      const result = await loginService(data.username, data.password);
      console.log("Login successful:", result);
      login(result);
      alert(`Welcome, ${result.username}!`);
      navigate("/home");
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Log in</h2>

      <div>
        <label htmlFor="username">Username</label>
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
        {errors.username && <p>{errors.username.message}</p>}

        <label htmlFor="password">Password</label>
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
          style={{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!isDirty || !isValid || isSubmitting || isLoggedIn}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default LoginForm;
