import React from "react";
import AxiosConfig from "../config/axiosConfig";

const RESOURCE = "/api/couriers";

export async function createCourier(data) {
  const response = await AxiosConfig.post(`${RESOURCE}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
export async function editWorkHours(courierId, data) {
  try {
    const response = await AxiosConfig.put(
      `${RESOURCE}/${courierId}/working-hours`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update working hours:", error);
    throw error;
  }
}
export async function getCourierById(courierId) {
  const response = await AxiosConfig.get(`${RESOURCE}/${courierId}`);
  return response.data;
}
export async function updateCourierStatus() {
  try {
    const response = await AxiosConfig.put(`${RESOURCE}/status`);
    return response.data;
  } catch (err) {
    console.error("Failed to update courier status:", err.message);
    return null;
  }
}
