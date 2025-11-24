import React, { useState, useEffect, useContext } from "react";
import { Switch, FormControlLabel, Button, ButtonGroup } from "@mui/material";
import "../../../styles/CourierWorkingHours.scss";
import "../../../styles/popups.scss";
import { MoonIcon } from "lucide-react";
import {
  getCourierById,
  editWorkHours,
} from "../../../services/CourierService";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import SucessPopup from "../../pages/Popups/SucessPopup";
import ConfirmationPopup from "../../pages/Popups/ConfirmationPopup";
import UserContext from "../../../config/UserContext";

const MAX_HOURS_PER_DAY = 10;
const MAX_HOURS_PER_WEEK = 40;

const CourierWorkingHours = () => {
  const [checkedDays, setCheckedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [workingHours, setWorkingHours] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {},
  });

  const [hoursRemaining, setHoursRemaining] = useState(MAX_HOURS_PER_WEEK);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { user } = useContext(UserContext);

  const handleCloseSuccess = () => setSucessMessage(false);
  const handleCloseError = () => setShowError(false);

  // get courierId from session storage

  let courierId = null;
  if (user) {
    courierId = user.id;
  }

  /** -------------------------------
   * Helper functions
   --------------------------------*/

  const parseTime = (time) => {
    if (!time || typeof time !== "string") return null;
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m; // return minutes
  };

  const calculateHours = (days, hours) => {
    let totalWeekMinutes = 0;

    for (const day of Object.keys(days)) {
      if (days[day]) {
        const from = parseTime(hours[day]?.from);
        const to = parseTime(hours[day]?.to);

        if (from === null || to === null) continue;
        const diff = to - from;
        if (diff < 0) {
          return {
            valid: false,
            error: `"From" time cannot be later than "To" time for ${day}`,
            remaining: MAX_HOURS_PER_WEEK - totalWeekMinutes / 60,
          };
        }
        const hoursInDay = diff / 60;
        if (hoursInDay > MAX_HOURS_PER_DAY) {
          return {
            valid: false,
            error: `You cannot work more than ${MAX_HOURS_PER_DAY} hours on ${day}`,
            remaining: MAX_HOURS_PER_WEEK - totalWeekMinutes / 60,
          };
        }
        totalWeekMinutes += diff;
      }
    }

    const totalWeekHours = totalWeekMinutes / 60;
    if (totalWeekHours > MAX_HOURS_PER_WEEK) {
      return {
        valid: false,
        error: `You cannot work more than ${MAX_HOURS_PER_WEEK} hours per week`,
        remaining: MAX_HOURS_PER_WEEK - totalWeekHours,
      };
    }

    return {
      valid: true,
      error: "",
      remaining: MAX_HOURS_PER_WEEK - totalWeekHours,
    };
  };

  const validateAndUpdate = (days, hours) => {
    const result = calculateHours(days, hours);
    setHoursRemaining(result.remaining);
    if (!result.valid) {
      setErrorMessage(result.error);
      setShowError(true);
      return false;
    }
    return true;
  };

  /*Handlers*/

  const handleSwitchChange = (day) => {
    setCheckedDays((prev) => {
      const updated = { ...prev, [day]: !prev[day] };
      validateAndUpdate(updated, workingHours);
      return updated;
    });
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingHours((prev) => {
      const updated = { ...prev, [day]: { ...prev[day], [field]: value } };
      validateAndUpdate(checkedDays, updated);
      return updated;
    });
  };

  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmYes = async () => {
    setShowConfirmation(false);
    await saveWorkHours();
  };

  const handleConfirmNo = () => setShowConfirmation(false);

  const saveWorkHours = async () => {
    if (!validateAndUpdate(checkedDays, workingHours)) return;

    try {
      const payload = Object.keys(checkedDays)
        .filter((day) => checkedDays[day])
        .map((day) => ({
          dayOfTheWeek: day,
          startingTime: workingHours[day].from + ":00",
          endingTime: workingHours[day].to + ":00",
        }));

      await editWorkHours(courierId, payload);
      setSucessMessage(true);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const courier = await getCourierById(courierId);

        const daysState = {};
        const hoursState = {};

        Object.keys(checkedDays).forEach((day) => {
          daysState[day] = false;
          hoursState[day] = {};
        });

        courier.workingHours.forEach((wh) => {
          const day = wh.dayOfTheWeek;
          daysState[day] = true;
          hoursState[day] = {
            from: wh.startingTime.slice(0, 5),
            to: wh.endingTime.slice(0, 5),
          };
        });

        setCheckedDays(daysState);
        setWorkingHours(hoursState);
        validateAndUpdate(daysState, hoursState);
      } catch (err) {
        setErrorMessage(err.message);
        setShowError(true);
      }
    };

    loadWorkingHours();
  }, [courierId]);

  return (
    <div id="container">
      <p className="hoursRemaining">
        Remaining hours per week:{" "}
        <span style={{ color: "orange" }}>{hoursRemaining}</span>
      </p>

      {Object.keys(checkedDays).map((day) => (
        <div key={day} id="switchInput">
          <FormControlLabel
            control={
              <Switch
                checked={checkedDays[day]}
                onChange={() => handleSwitchChange(day)}
                className="switchCourier"
              />
            }
            label={day}
          />

          {!checkedDays[day] && (
            <p className="closedInput">
              <MoonIcon className="icon" size={20} /> Closed
            </p>
          )}

          {checkedDays[day] && (
            <div className="inputWrapper">
              <span className="fromSpan">From</span>
              <input
                type="time"
                value={workingHours[day]?.from || ""}
                max={workingHours[day]?.to || ""}
                onChange={(e) => handleTimeChange(day, "from", e.target.value)}
              />
              <span className="toSpan">To</span>
              <input
                type="time"
                value={workingHours[day]?.to || ""}
                min={workingHours[day]?.from || ""}
                onChange={(e) => handleTimeChange(day, "to", e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      <div id="buttonSucessMsgContainer">
        <ButtonGroup>
          <Button onClick={handleSaveClick}>Save</Button>
        </ButtonGroup>

        {sucessMessage && (
          <SucessPopup
            message="Succesfully added work hours"
            timeOut={2}
            onClose={handleCloseSuccess}
          />
        )}
      </div>

      {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to save these working hours?"
          onYes={handleConfirmYes}
          onNo={handleConfirmNo}
        />
      )}

      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </div>
  );
};

export default CourierWorkingHours;
