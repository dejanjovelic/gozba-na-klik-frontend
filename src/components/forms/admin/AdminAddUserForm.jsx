import React, { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { EyeOff, Eye } from "lucide-react";
import "../../../styles/adminAddUserForm.scss";
import { createCourier } from "../../../services/CourierService";
import { createRestaurantOwner } from "../../../services/RestaurantOwnerService";

const AdminAddUserForm = ({ open, handleClose, errorMsg, successMsg }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');

  const onSubmit = async (data) => {
    try {
      const user = role === "courier" ? await createCourier(data) : await createRestaurantOwner(data);
      successMsg(`You have successfuly created ${user.role}.`);
    } catch (error) {
      if (error.status) {
        if (error.status === 500) {
          errorMsg("Server is temporarily unavailable. Please refresh or try again later.")
        } else {
          errorMsg(`Error: ${error.status}`);
        }
      } else if (error.request) {
        errorMsg("The server is not responding. Please try again later.");

      } else {
        errorMsg("Something went wrong. Please try again.");
      }
      console.log(`An error occured while creating User:`, error);
    }

    onClose();
  };

  const onClose = () => {
    handleClose();
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-user-title"
      aria-describedby="add-user-description"
    >
      <Box className="add-user-modal">
        <h2 id="add-user-title">Add New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          <TextField
            label="Name"
            fullWidth
            className={`custom-input ${errors.name ? "error-field" : ""}`}
            {...register("name", {
              required: "Name is required.",
              minLength: { value: 3, message: "Minimum 3 characters." },
            })}
          />
          {<div className="input-error-message">{errors.name?.message}</div>}


          <TextField
            label="Surname"
            fullWidth
            className={`custom-input ${errors.surname ? "error-field" : ""}`}
            {...register("surname", {
              required: "Surname is required.",
              minLength: { value: 3, message: "Minimum 3 characters." },
            })}
          />
          {<div className="input-error-message">{errors.surname?.message}</div>}

          <TextField
            label="Username"
            fullWidth
            className={`custom-input ${errors.username ? "error-field" : ""}`}
            {...register("username", {
              required: "Username is required.",
              minLength: { value: 3, message: "Minimum 3 characters." },
            })}
          />
          {<div className="input-error-message">{errors.username?.message}</div>}

          <TextField
            label="Email"
            fullWidth
            className={`custom-input ${errors.email ? "error-field" : ""}`}
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address.",
              },
            })}
          />
          {<div className="input-error-message">{errors.email?.message}</div>}

          <TextField
            label="Phone Number"
            placeholder="+381637566778"
            fullWidth
            className={`custom-input ${errors.phoneNumber ? "error-field" : ""}`}
            {...register("phoneNumber", {
              required: "Phone number is required.",
              pattern: {
                value: /^\+3816\d{7,8}$/,
                message: "Use format +3816XXXXXXXX",
              },
            })}
          />
          {<div className="input-error-message">{errors.phoneNumber?.message}</div>}

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            className={`custom-input ${errors.password ? "error-field" : ""}`}
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 8, message: "Minimum 8 characters." },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {<div className="input-error-message">{errors.password?.message}</div>}
          <div className="role-div">
            <label className="role-label">Role</label>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel
                value="courier"
                control={<Radio />}
                label="Courier"
              />
              <FormControlLabel
                value="restaurantOwner"
                control={<Radio />}
                label="Restaurant Owner"
              />
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="submit-btn"
            variant="contained"
            disabled={!isValid}
          >
            Add User
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AdminAddUserForm;
