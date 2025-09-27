import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { login } from "../../../services/userServices";
import { useNavigate } from "react-router-dom";

const LoginForm = () =>{
     const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm({ mode: "onChange" });
 const [showPassword, setShowPassword] = useState(false);
 const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      
      const result = await login(data.username, data.password);
      console.log("Login successful:", result);
      alert(`Welcome, ${result.username}!`);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(result));
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
        <input id="username" placeholder="Your username" {...register("username", { required: "Username is required", 
        minLength:{
              value: 3,
              message: "Username must be at least 3 characters",}})}/><br/>
        {errors.username && <p>{errors.username.message}</p>}
        <label htmlFor="password">Password</label>
        <input placeholder="Your password" id="password" type={!showPassword ? "password" : "text"}{...register("password", 
            {required: "Password is required",
             minLength:{
              value: 8,
              message: "Password must be at least 8 characters",
        }})}/><br/>    
        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{border:"none", backgroundColor:"white", cursor:"pointer"}}>
          {showPassword ? "🙈" : "👁️"}
        </button>
        {errors.password && <p>{errors.password.message}</p>} 
        
     </div>
      <button
        type="submit"
        disabled={!isDirty || !isValid || isSubmitting || sessionStorage.getItem("isLoggedIn")==="true"} >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

    </form>
  );
}
export default LoginForm;