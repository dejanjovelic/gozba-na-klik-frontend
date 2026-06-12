import React, { useContext, useEffect, useState } from "react";
import "../styles/userProfile.scss";
import { updateProfileImage, getProfile } from "../services/userServices";
import ErrorPopup from "../../../shared/components/Popups/ErrorPopup";
import UserContext from "../../../shared/context/UserContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import HandleError from "../../../shared/components/HandleError";
export default function UserProfile() {
  const [preview, setPreview] = useState(null);
  // const [showOldPass, setShowOldPass] = useState(false);
  // const [showNewPass, setShowNewPass] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    surname: "",
    email: "",
    contact: "",
    oldPassword: "",
    newPassword: "",
  });
  const [data, setData] = useState();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    setPreview(URL.createObjectURL(file));

    // Prepare form data for Cloudinary
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_react_upload");
    data.append("cloud_name", "dsgans7nh");
    data.append("folder", "ProfilePictures");
    var imageUrl;
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dsgans7nh/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      const cloudinaryData = await res.json();
      console.log("Cloudinary response:", cloudinaryData);

      imageUrl = cloudinaryData.secure_url;

      setFormState((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
      console.log(imageUrl);
    } catch (err) {
      setErrorMessage("Image failed to upload");
      setShowError(true);
    }

    try {
      const token = await updateProfileImage(imageUrl);
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        entity: "User image URL",
      });
    }
  };

  const handleCancel = () => {
    setMessage(null);
  };

  useEffect(() => {
    if (user == null) {
      navigate("/");
    }
    GetProfileAsync();
  }, []);

  const GetProfileAsync = async () => {
    try {
      const payload = await getProfile();
      setFormState((prev) => ({
        ...prev,
        name: payload.name || "",
        surname: payload.surname || "",
        email: payload.email || "",
        contact: payload.phoneNumber || "",
      }));

      setPreview(payload.profileImageUrl);
      setRole(payload.role);
    } catch (error) {
      HandleError({
        error,
        setErrorMessage: setErrorMessage,
        entity: "User profile",
      });
    }
  };
  return (
    <div className="user-profile-wrapper">
      <div className="user-profile-section">
        <div className="user-profile-container">
          <div className="leftCard">
            <div className="avatarWrap">
              <div className="avatarBox">
                {preview ? (
                  <img src={preview} alt="Preview" className="avatarImg" />
                ) : (
                  <div className="noImage">No image</div>
                )}
              </div>
              <label className="editBtn">
                <input
                  type="file"
                  className="hiddenInput"
                  onChange={handleImageUpload}
                />
                ✎
              </label>
            </div>

            <h2 className="name">
              {formState.name} {formState.surname}
            </h2>
            <p className="role">{role}</p>
          </div>

          <div className="rightCard">
            <h2 className="profileTitle">Profile</h2>

            <form className="form">
              <div className="rowTwo">
                <div className="field">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>

                <div className="field">
                  <label className="label">Surname</label>
                  <input
                    className="input"
                    name="surname"
                    value={formState.surname}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <input
                  className="input"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>

              <div className="field">
                <label className="label">Contact Number</label>
                <input
                  className="input"
                  name="contact"
                  value={formState.contact}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>

              {/*}
            <div className="field relative">
              <label className="label">Old Password</label>
              <input
                type={showOldPass ? "text" : "password"}
                className="input"
                name="oldPassword"
                value={formState.oldPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowOldPass(!showOldPass)}
              >
                {showOldPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {/*
            <div className="field relative">
              <label className="label">New Password</label>
              <input
                type={showNewPass ? "text" : "password"}
                className="input"
                name="newPassword"
                value={formState.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
*/}

              {/*<div className="buttons">
              <button type="submit" className="editButton">
                Edit
              </button>
              <button
                type="button"
                className="cancelButton"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>*/}

              {message && (
                <div className="success">
                  <span className="check">✔</span>
                  <p>{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {errorMessage || showError (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
