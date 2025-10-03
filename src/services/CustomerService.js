import React from "react";
import AxiosConfig from "../config/axiosConfig";
const RESOURCE = "/api/customers";

export async function createCustomer(data) {
  const response = await AxiosConfig.post(`${RESOURCE}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
