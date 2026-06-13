import React, { useContext, useMemo, useState } from "react";
import "../../styles/RestaurantOwnerEditRestaurantStyle.scss";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import {
  fetchRestaurantWithWorkingHoursAndNonWorkingDates,
  updateRestaurant,
  updateRestaurantBasicData,
  updateRestaurantImageUrl,
  updateRestaurantNonWorkingDates,
  updateRestaurantWorkingHours,
} from "../../../Restaurant/services/RestaurantService.js";
import { useEffect } from "react";
import { CirclePlus, ImageUp } from "lucide-react";
import { ImageUploader } from "../../../../shared/components/ImageUploader.jsx";
import RestaurantNonWorkingDateForm from "../components/RestaurantNonWorkingDateForm.jsx";
import BasicRestaurntDataForm from "../components/BasicRestaurantDataForm";
import RestaurantWorkingHoursForm from "../components/RestaurantWorkingHoursForm";
import SucessPopuUp from "../../../../shared/components/Popups/SucessPopup.jsx";
import HandleError from "../../../../shared/components//HandleError.jsx";
import ErrorPopup from "../../../../shared/components/Popups//ErrorPopup";
import { useForm } from "react-hook-form";
import UserContext from "../../../../shared/context/UserContext.jsx";
import { useUnsavedChangesWarning } from "../../../../shared/hooks/useUnsavedChangesWarning.js";

const RestaurantOwnerEditRestaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newNonWorkingDate, setNewNonWorkingDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [workingHourWithMissingData, setWorkingHourWithMissingData] =
    useState(null);
  const [initialRestaurant, setInitialRestaurant] = useState(null);
  const navigate = useNavigate();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isAnythigDirty && currentLocation.pathname !== nextLocation.pathname,
  );
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role.toLowerCase().trim() !== "restaurantowner") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchRestaurantWithWorkingDataFromDb = async () => {
    if (!id) return;
    try {
      const restaurantWithWorkingData =
        await fetchRestaurantWithWorkingHoursAndNonWorkingDates(id);
      if (restaurantWithWorkingData.nonWorkingDates) {
        restaurantWithWorkingData.nonWorkingDates =
          restaurantWithWorkingData.nonWorkingDates.map((nwd) => ({
            date: formateDate(nwd.date),
            restaurantId: nwd.restaurantId,
          }));
      }

      setRestaurant(restaurantWithWorkingData);
      setInitialRestaurant(structuredClone(restaurantWithWorkingData));
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "Restaurant"
      });
    }
  };

  function formateDate(date) {
    const dateToFormat = new Date(date);
    const day = dateToFormat.getDate().toString().padStart(2, "0");
    const month = (dateToFormat.getMonth() + 1).toString().padStart(2, "0");
    const year = dateToFormat.getFullYear().toString();
    return `${day}.${month}.${year}.`;
  }

  useEffect(() => {
    fetchRestaurantWithWorkingDataFromDb();
  }, []);

  const isBasicDataDirty = (current, initial) => {
    return (
      current.address !== initial.address ||
      current.city !== initial.city ||
      current.description !== initial.description ||
      current.capacity !== initial.capacity
    );
  };

  const isWorkingHoursDirty = (current, initial) => {
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const isNonWorkingDatesDirty = (current, initial) => {
    return JSON.stringify(current) !== JSON.stringify(initial);
  };

  const dirtySection = useMemo(() => {
    if (!restaurant || !initialRestaurant) {
      return {
        basicData: false,
        workingHours: false,
        nonWorkingDates: false,
      };
    }

    return {
      basicData: isBasicDataDirty(restaurant, initialRestaurant),
      workingHours: isWorkingHoursDirty(
        restaurant.workingHours,
        initialRestaurant.workingHours,
      ),
      nonWorkingDates: isNonWorkingDatesDirty(
        restaurant.nonWorkingDates,
        initialRestaurant.nonWorkingDates,
      ),
    };
  }, [restaurant, initialRestaurant]);

  const isAnythigDirty =
    dirtySection.basicData ||
    dirtySection.workingHours ||
    dirtySection.nonWorkingDates;

  const handleBasicDataChange = (data) => {
    setRestaurant((prev) => ({ ...prev, ...data }));
  };

  const handleBasicDataSubmit = async () => {
    try {
      await updateRestaurantBasicData(
        {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          city: restaurant.city,
          description: restaurant.description,
          capacity: restaurant.capacity,
        },
        restaurant.id,
      );
      setInitialRestaurant((prev) => ({
        ...prev,
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        description: restaurant.description,
        capacity: restaurant.capacity,
      }));
      setSuccessMessage("Restaurant basic data has been saved.");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        badRequestmessage: "Invalid restaurant data",
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "Restaurant"
      });
    }
  };

  const handleWorkingHoursChange = (data) => {
    setRestaurant((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((wh) =>
        wh.dayOfTheWeek === data.dayOfTheWeek ? { ...wh, ...data } : wh,
      ),
    }));
  };

  function findIncompleteWorkingHours() {
    const result = restaurant.workingHours.filter(
      (wh) =>
        wh.isRestaurantOpen === true &&
        ((wh.startingTime === null && wh.endingTime !== null) ||
          (wh.startingTime !== null && wh.endingTime === null) ||
          (wh.startingTime === null && wh.endingTime === null)),
    );
    return result;
  }

  const handleSaveWorkingHoursChanges = async () => {
    const incompleteWorkingHours = findIncompleteWorkingHours();
    if (incompleteWorkingHours.length > 0) {
      setInputErrorMessage(
        "If a restaurant is open, it must have opening and closing times.",
      );
      setWorkingHourWithMissingData(incompleteWorkingHours);
      return;
    }

    try {
      await updateRestaurantWorkingHours(
        restaurant.workingHours,
        restaurant.id,
      );
      setInitialRestaurant((prev) => ({
        ...prev,
        workingHours: structuredClone(restaurant.workingHours),
      }));
      setSuccessMessage("Restaurant working hours have been saved.");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        badRequestmessage: "Invalid restaurant working hour data",
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "Restaurant working hours"
      });
    }
  };

  const handleDeleteNonWorkingDate = (date) => {
    setRestaurant((prev) => ({
      ...prev,
      nonWorkingDates: prev.nonWorkingDates.filter((nwd) => nwd.date !== date),
    }));
  };

  const handleAddNewNonWorkingDate = () => {
    if (checkIfDateExist(newNonWorkingDate)) {
      setInputErrorMessage("Chosen date already exist!");
      return;
    }

    if (checkIfDateIsInFuture(newNonWorkingDate)) {
      setInputErrorMessage("Chosen date must be greater than today!");
      return;
    }

    setRestaurant((prev) => ({
      ...prev,
      nonWorkingDates: [
        ...prev.nonWorkingDates,
        { date: formateDate(newNonWorkingDate), restaurantId: restaurant.id },
      ],
    }));

    setIsOpen(false);
    setNewNonWorkingDate(new Date().toISOString().slice(0, 10));
  };

  function checkIfDateExist(newNonWorkingDate) {
    return restaurant?.nonWorkingDates.some(
      (nwd) => nwd.date === formateDate(newNonWorkingDate),
    );
  }

  function checkIfDateIsInFuture(dateStr) {
    return new Date() > new Date(dateStr);
  }

  function formateUtcDate(date) {
    const stringDateElements = date.split(".");
    const utcDate = new Date(
      `${stringDateElements[2]}-${stringDateElements[1]}-${stringDateElements[0]}`,
    );
    return utcDate.toISOString();
  }

  const handleSaveNonWorkingDatesChanges = async () => {
    try {
      const formatedDates = restaurant.nonWorkingDates.map((nwd) => ({
        date: formateUtcDate(nwd.date),
        restaurantId: restaurant.id,
      }));
      await updateRestaurantNonWorkingDates(formatedDates, restaurant.id);
      setInitialRestaurant((prev) => ({
        ...prev,
        nonWorkingDates: structuredClone(restaurant.nonWorkingDates),
      }));
      setSuccessMessage("Restaurant non-working dates have been saved.");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        badRequestmessage: "Invalid restaurant non-working dates data",
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "Restaurant non-working dates"
      });
    }
  };

  async function handleImageUpload(e) {
    await ImageUploader(
      e,
      "RestaurantsPictures",
      "restaurantImageUrl",
      setRestaurant,
      updateRestaurantImageUrlInDb,
      setErrorMessage,
      setShowError,
    );
  }

  const updateRestaurantImageUrlInDb = async (imageUrl) => {
    try {
      await updateRestaurantImageUrl(imageUrl, restaurant.id);
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        badRequestmessage: "Invalid restaurant image data",
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "image"
      });
    }
  };

  const isRestaurantDataComplited = useMemo(() => {
    return (
      restaurant?.address !== null &&
      restaurant?.address?.length !== 0 &&
      restaurant?.capacity !== null &&
      restaurant?.capacity !== 0 &&
      restaurant?.city !== null &&
      restaurant?.city.length !== 0 &&
      restaurant?.workingHours.some((wh) => wh.startingTime !== null) &&
      restaurant?.workingHours.some((wh) => wh.endingTime !== null)
    );
  }, [restaurant]);

  const handlePublishingRestaurant = async () => {
    if (!isRestaurantDataComplited) return;
    try {
      const formatedNonWorkingDates = restaurant.nonWorkingDates.map((nwd) => ({
        ...nwd,
        date: formateUtcDate(nwd.date),
      }));
      const formatedRestaurantData = {
        ...restaurant,
        nonWorkingDates: formatedNonWorkingDates,
      };
      await updateRestaurant(restaurant.id, formatedRestaurantData);
      setSuccessMessage("Restaurant has been updated.");
    } catch (error) {
      HandleError({
        error: error,
        setErrorMessage: setErrorMessage,
        badRequestmessage: "Invalid restaurant publishing data",
        notFoundMessage: `Restaurant with Id: ${id}`,
        entity: "Publishing restaurant"
      });
    }
  };

  const handleSuccessMessageModalClose = () => {
    setSuccessMessage("");
  };

  useUnsavedChangesWarning(isAnythigDirty);
  console.log("Restoran sa edit forme",restaurant)

  return (
    <div className="restaurant-owner-edit-page-container">
      <div className="restaurant-owner-edit-page-title-wrapper">
        <h1 className="restaurant-owner-edit-page-title">{restaurant?.name}</h1>
      </div>

      {restaurant && (
        <div className="restaurant-owner-edit-page-restaurant-container">
          {restaurant.restaurantImageUrl ? (
            <div className="restaurant-owner-edit-restaurant-image-section-wrapper">
              <img
                src={restaurant.restaurantImageUrl}
                alt="Restaurant photo"
                className="restaurant-owner-edit-restaurant-image"
              />
            </div>
          ) : (
            <div className="restaurant-owner-edit-restaurant-image-section-wrapper-no-image">
              <div className="restaurant-owner-edit-restaurant-image-wrapper">
                <img
                  src={null}
                  alt="Restaurant photo"
                  className="restaurant-owner-edit-restaurant-image"
                />

                <input
                  id="restaurantImageUpload"
                  className="restaurant-owner-edit-restaurant-image-input"
                  type="file"
                  accept=".jpg, .pdf"
                  onChange={handleImageUpload}
                />

                <label
                  htmlFor="restaurantImageUpload"
                  className="image-upload-label"
                >
                  <ImageUp />
                </label>
              </div>
            </div>
          )}

          <div className="restaurant-owner-edit-page-data-section-wrapper">
            <div className="restaurant-owner-edit-page-restaurant-basic-data-section-wrapper">
              <BasicRestaurntDataForm
                handleBasicDataChange={handleBasicDataChange}
                basicResturantFormData={restaurant}
                handleBasicDataSubmit={handleBasicDataSubmit}
                isDisabled={!dirtySection?.basicData}
              />
            </div>

            <div className="resturant-owner-edit-page-restaurant-working-hours-section-wrapper">
              {restaurant.workingHours && (
                <RestaurantWorkingHoursForm
                  workingHours={restaurant.workingHours}
                  handleWorkingHoursChange={handleWorkingHoursChange}
                  handleSaveWorkingHoursChanges={handleSaveWorkingHoursChanges}
                  inputErrorMessage={inputErrorMessage}
                  setInputErrorMessage={setInputErrorMessage}
                  isDisabled={!dirtySection?.workingHours}
                  workingHourWithMissingData={workingHourWithMissingData}
                />
              )}
            </div>

            <div className="restaurant-owner-edit-restaurant-non-working-dates-section-wrapper">
              <RestaurantNonWorkingDateForm
                setNewNonWorkingDate={setNewNonWorkingDate}
                handleAddNewNonWorkingDate={handleAddNewNonWorkingDate}
                newNonWorkingDate={newNonWorkingDate}
                handleDeleteNonWorkingDate={handleDeleteNonWorkingDate}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleSaveNonWorkingDatesChanges={
                  handleSaveNonWorkingDatesChanges
                }
                nonWorkingDates={restaurant?.nonWorkingDates}
                inputErrorMessage={inputErrorMessage}
                isDisabled={!dirtySection?.nonWorkingDates}
                setInputErrorMessage={setInputErrorMessage}
              />
            </div>

            <div className="resturant-owner-edit-page-publish-button-section-wrapper">
              <button
                type="button"
                className={`restaurant-owner-edit-page-publish-buttton positive-action ${restaurant.isCreated === true ? "save-cahnges" : "publish"}`}
                disabled={!isRestaurantDataComplited || !isAnythigDirty}
                onClick={handlePublishingRestaurant}
              >
                {restaurant.isCreated === true ? "Save changes" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <SucessPopuUp
          message={successMessage}
          onClose={handleSuccessMessageModalClose}
          timeOut={2}
        />
      )}

      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};
export default RestaurantOwnerEditRestaurant;
