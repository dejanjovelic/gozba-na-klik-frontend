import React, { useEffect } from "react";
import { updateCourierStatus } from "../../../services/CourierService";

const CourierStatusUpdater = () => {

  useEffect(() => {
    const updateStatus = async () => {

      try {
        await updateCourierStatus();
        console.log(" Courier statuses updated successfully");
      } catch (err) {
        console.error(" Failed to update status:", err);
      }

    };
    updateStatus();

    const interval = setInterval(updateStatus, 30 * 1000);
    return () => clearInterval(interval);

  }, []);
  return null;

};

export default CourierStatusUpdater;
