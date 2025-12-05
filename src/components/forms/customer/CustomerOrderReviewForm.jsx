import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import "../../../styles/customerOrderReviewForm.scss";
import { createOrderReviewAsync } from "../../../services/OrderReviewService";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
const CustomerOrderReviewForm = ({
  OrderId,
  handleClose,
  onReviewSubmitted,
}) => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      RestaurantRating: 5,
      CourierRating: 5,
      RestaurantComment: "",
      CourierComment: "",
      RestaurantReviewImage: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => setShowError(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // If a file was chosen → upload before sending review
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "unsigned_react_upload");
        formData.append("folder", "Restaurant Reviews");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dsgans7nh/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const cloudinaryData = await res.json();
        imageUrl = cloudinaryData.secure_url || "";
      }

      const review = {
        OrderId,
        ...data,
        RestaurantReviewImage: imageUrl, // attach uploaded image URL
      };
      console.log(review);
      await createOrderReviewAsync(review);
      if (onReviewSubmitted) onReviewSubmitted(OrderId);
      handleClose();
    } catch (err) {
      setShowError(true);
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <div id="Overlay"></div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="review-form"
      >
        <Stack spacing={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" className="form-title">
              Submit Order Review
            </Typography>
            <Button variant="outlined" size="small" onClick={handleClose}>
              x
            </Button>
          </Box>

          {/* Restaurant Rating */}
          <Box className="rating-section">
            <Typography gutterBottom>Restaurant Rating</Typography>
            <Controller
              name="RestaurantRating"
              control={control}
              rules={{ required: "Restaurant rating is required" }}
              render={({ field }) => (
                <Slider
                  {...field}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                />
              )}
            />
          </Box>

          {/* Restaurant Comment */}
          <TextField
            label="Restaurant Comment"
            multiline
            rows={3}
            fullWidth
            {...register("RestaurantComment")}
            error={!!errors.restaurantComment}
            helperText={errors.restaurantComment?.message}
          />

          <Typography variant="body2" className="fileLabel">
            Upload an image of your order
          </Typography>
          <Controller
            name="RestaurantReviewImage"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            )}
          />

          {/* Courier Rating */}
          <Box className="rating-section">
            <Typography gutterBottom>Courier Rating</Typography>
            <Controller
              name="CourierRating"
              control={control}
              rules={{ required: "Courier rating is required" }}
              render={({ field }) => (
                <Slider
                  {...field}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                />
              )}
            />
          </Box>

          {/* Courier Comment */}
          <TextField
            label="Courier Comment"
            multiline
            rows={3}
            fullWidth
            {...register("CourierComment")}
          />

          <Button
            id="submitBtn"
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="spinner"></span> : "Submit Review"}
          </Button>
        </Stack>
      </Box>
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </>
  );
};

export default CustomerOrderReviewForm;
